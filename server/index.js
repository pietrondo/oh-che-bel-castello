const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const SAVES_DIR = path.join(__dirname, 'saves');

app.use(cors());
app.use(express.json({ limit: '10mb' }));

async function ensureSavesDir() {
  try {
    await fs.access(SAVES_DIR);
  } catch {
    await fs.mkdir(SAVES_DIR, { recursive: true });
  }
}

async function loadSaves() {
  await ensureSavesDir();
  try {
    const files = await fs.readdir(SAVES_DIR);
    const saves = await Promise.all(
      files
        .filter(f => f.endsWith('.json'))
        .map(async file => {
          const content = await fs.readFile(path.join(SAVES_DIR, file), 'utf-8');
          return JSON.parse(content);
        })
    );
    return saves.sort((a, b) => b.date - a.date);
  } catch (error) {
    console.error('Error loading saves:', error);
    return [];
  }
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/saves', async (req, res) => {
  try {
    const saves = await loadSaves();
    res.json(saves);
  } catch (error) {
    console.error('Error listing saves:', error);
    res.status(500).json({ error: 'Failed to list saves' });
  }
});

app.post('/api/save', async (req, res) => {
  try {
    const { id, name, gameState } = req.body;
    
    if (!id || !gameState) {
      return res.status(400).json({ error: 'Missing required fields: id, gameState' });
    }

    await ensureSavesDir();
    
    const saveData = {
      id,
      name: name || `Save ${id}`,
      date: Date.now(),
      gameState
    };

    const filePath = path.join(SAVES_DIR, `save-${id}.json`);
    await fs.writeFile(filePath, JSON.stringify(saveData, null, 2));
    
    console.log(`Save created: save-${id}.json`);
    res.json({ success: true, save: saveData });
  } catch (error) {
    console.error('Error saving game:', error);
    res.status(500).json({ error: 'Failed to save game' });
  }
});

app.get('/api/load/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const filePath = path.join(SAVES_DIR, `save-${id}.json`);
    
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const save = JSON.parse(content);
      res.json(save);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return res.status(404).json({ error: 'Save not found' });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error loading save:', error);
    res.status(500).json({ error: 'Failed to load save' });
  }
});

app.delete('/api/save/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const filePath = path.join(SAVES_DIR, `save-${id}.json`);
    
    try {
      await fs.unlink(filePath);
      console.log(`Save deleted: save-${id}.json`);
      res.json({ success: true });
    } catch (error) {
      if (error.code === 'ENOENT') {
        return res.status(404).json({ error: 'Save not found' });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error deleting save:', error);
    res.status(500).json({ error: 'Failed to delete save' });
  }
});

app.listen(PORT, () => {
  console.log(`🎮 Game server running on http://localhost:${PORT}`);
  console.log(`📁 Saves directory: ${SAVES_DIR}`);
});
