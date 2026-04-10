const API_BASE_URL = 'http://localhost:3001';

export interface RemoteSaveSlot {
  id: string;
  name: string;
  date: number;
  gameState: any;
}

export interface SaveApiResponse {
  success: boolean;
  save?: RemoteSaveSlot;
  error?: string;
}

export async function fetchRemoteSaves(): Promise<RemoteSaveSlot[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/saves`);
    if (!response.ok) throw new Error('Failed to fetch saves');
    return await response.json();
  } catch (error) {
    console.error('Error fetching remote saves:', error);
    return [];
  }
}

export async function saveToRemote(id: string, name: string, gameState: any): Promise<SaveApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, name, gameState })
    });
    return await response.json();
  } catch (error) {
    console.error('Error saving to remote:', error);
    return { success: false, error: 'Network error' };
  }
}

export async function loadFromRemote(id: string): Promise<RemoteSaveSlot | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/load/${id}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Failed to load save');
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading from remote:', error);
    return null;
  }
}

export async function deleteFromRemote(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/save/${id}`, {
      method: 'DELETE'
    });
    return response.ok;
  } catch (error) {
    console.error('Error deleting from remote:', error);
    return false;
  }
}

export async function checkServerHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.ok;
  } catch {
    return false;
  }
}
