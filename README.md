# 🏰 oh che bel castello

Un RTS gestionale medievale avanzato per browser, dove vesti i panni di un sovrano incaricato di trasformare un piccolo mastio in un fiorente impero.

## 🌟 Caratteristiche

### 🎮 Gameplay
*   **Gestionale in Tempo Reale**: Costruisci edifici, gestisci risorse e sviluppa il tuo regno
*   **Setup Personalizzato**: Scegli nome, dinastia, regione e difficoltà all'inizio di ogni partita
*   **Sistema di Costruzione**: Clicca su un edificio e posizionalo sulla mappa
*   **Upgrade Edifici**: Migliora i tuoi edifici fino al livello 5 con costi e benefici crescenti
*   **Assegnazione Lavoratori**: Ogni edificio produttivo può avere lavoratori assegnati
*   **Ricerca Tecnologica**: Sblocca avanzamenti in Economia, Scienza, Militare e Sociale
*   **Eventi Dinamici**: Oltre 30 eventi con scelte multiple e conseguenze a catena
*   **Sistema Religioso**: Gestisci rapporti con la Chiesa, scomuniche, crociate ed eresie
*   **Intrighi di Corte**: Cospirazioni, tradimenti, assassinii e favori tra fazioni
*   **Successione Dinastica**: Eredi multipli, leggi di successione e crisi dinastiche
*   **Diplomazia Avanzata**: 8 tipi di missioni diplomatiche con regni vicini

### 💎 Design System
*   **Interfaccia Desktop**: Navigazione verticale a sinistra per un'esperienza immersiva
*   **HUD Dinamico**: Monitora risorse, popolazione, difesa e anno di gioco
*   **Sidebar Costruzioni**: Edifici organizzati in categorie (Base, Industria, Corte)
*   **Grafica Migliorata**: Immagini isometriche per tutti gli edifici
*   **Temi Medievali**: Font decorativi e colori ispirati all'epoca medievale

### 📈 Economia Avanzata
*   **17 Risorse**: Legno, Pietra, Cibo, Oro, Ferro, Attrezzi e risorse di lusso
*   **Filiere Produttive**: Grano → Farina → Pane, Lana → Tessuto, ecc.
*   **Sistema Finanziario**: Inflazione, debito pubblico e tasse
*   **Fazioni**: Mercanti, Clero e Militari con favori e bonus

### 🗺️ Mappa e Urbanistica
*   **Griglia 50x50**: Spazio ampio per costruire il tuo impero
*   **Risorse Naturali**: Foreste, cave di pietra e miniere di ferro
*   **Edifici Speciali**: Strade, mura, torri per la difesa del regno

### 🌍 Regioni e Difficoltà
*   **5 Regioni**: Nord (minerali), Sud (agricoltura), Est (foreste), Ovest (commercio), Centrale (bilanciato)
*   **3 Difficoltà**: Conte (facile), Duca (normale), Re (difficile)

## 🏗️ Edifici Disponibili

### Base
| Edificio | Costo | Produzione | Lavoratori |
|----------|-------|------------|------------|
| Casa | 25 Legno | +6 Popolazione | 0 |
| Fattoria | 15 Legno | 8 Grano | 2 |
| Segheria | 15 Legno, 10 Pietra | 10 Legno | 3 |
| Cava | 30 Legno | 8 Pietra | 3 |
| Pozzo | 40 Pietra | +Salute | 0 |
| Strada | 4 Legno | +Felicità | 0 |

### Industria
| Edificio | Costo | Produzione | Lavoratori |
|----------|-------|------------|------------|
| Mulino | 60 Legno, 30 Pietra | 8 Farina (-6 Grano) | 2 |
| Forno | 80 Pietra, 40 Oro | 10 Pane (-5 Farina) | 2 |
| Fabbro | 40 Legno, 40 Pietra, 60 Oro | 3 Attrezzi (-3 Ferro, -2 Legno) | 3 |
| Miniera | 50 Legno, 25 Pietra | 4 Ferro | 4 |
| Birrificio | 80 Legno, 80 Oro | 6 Birra | 3 |
| Sartoria | 120 Oro, 4 Attrezzi | 3 Vestiti | 3 |
| Granaio | 40 Legno, 25 Pietra | Conserva cibo | 2 |
| Mercato | 60 Legno, 40 Oro | 6 Oro | 3 |
| Vigneto | 50 Legno, 35 Oro | 5 Vino | 2 |
| Gioielliere | 180 Oro, 8 Attrezzi | 2 Gioielli | 3 |
| Allevamento | 35 Legno | 6 Lana | 2 |
| Tessitoria | 60 Legno, 25 Oro | 5 Tessuto (-4 Lana) | 3 |

### Corte
| Edificio | Costo | Produzione | Lavoratori |
|----------|-------|------------|------------|
| Mastio Reale | 400 Oro, 250 Pietra | 8 Oro, 2 Prestigio, 1 Conoscenza | 0 |
| Caserma | 120 Pietra, 80 Oro | +Difesa | 6 |
| Università | 180 Pietra, 180 Oro | 10 Conoscenza | 4 |
| Chiesa | 80 Pietra, 40 Legno | 4 Pietà | 2 |
| Cattedrale | 700 Pietra, 900 Oro | 18 Pietà, 12 Prestigio | 8 |
| Maniero | 350 Pietra, 250 Oro | +12 Nobili | 4 |
| Mura | 25 Pietra | +Difesa | 0 |
| Torre | 120 Pietra | +Difesa | 3 |

## ⬆️ Sistema Upgrade

Ogni edificio può essere migliorato fino al **livello 5**:

| Livello | Benefici | Esempio (Fattoria) |
|---------|----------|-------------------|
| 1 | Base | 8 grano/tick |
| 2 | +30% produzione | 10.4 grano/tick |
| 3 | +70% produzione | 13.6 grano/tick |
| 4 | +120% produzione | 17.6 grano/tick |
| 5 | +180% produzione | 22.4 grano/tick |

**Come fare upgrade:**
1. Clicca su un edificio esistente
2. Clicca il pulsante ⬆️ che appare
3. Paga il costo in risorse
4. Goditi i benefici!

## 🔬 Tecnologie

### Economia
*   **Rotazione Triennale**: +30% produzione grano e cibo
*   **Contabilità**: Riduce l'inflazione del 50%

### Scienza
*   **Medicina Scolastica**: +20% salute globale della popolazione

### Militare
*   **Armature a Piastre**: +50 potenza difensiva fissa

### Sociale
*   **Teologia Avanzata**: +5 pietà/tick e sblocca Cattedrale

## 📜 Leggi

| Legge | Costo | Effetto |
|-------|-------|---------|
| Servitù della Gleba | 50 Oro | +50% produzione grano, -20 felicità |
| Diritto Divino | 150 Oro | +2 pietà/tick, nobili pagano più tasse |
| Legge Marziale | 200 Oro | +100 difesa, felicità cala costantemente |

## 🖥️ Server Salvataggi

Il gioco supporta salvataggi sia locali che remoti:

### Locale
*   3 slot di salvataggio
*   Nomi personalizzabili
*   Salvataggio automatico ogni tick

### Remoto (Backend)
```bash
cd server
npm install
npm start
```

**API Endpoints:**
- `GET /api/saves` - Lista salvataggi
- `POST /api/save` - Salva partita
- `GET /api/load/:id` - Carica partita
- `DELETE /api/save/:id` - Elimina salvataggio

## 🛠️ Tecnologie

*   **React 18** + **TypeScript**: Tipizzazione statica e componenti moderni
*   **Vite**: Build tool ultra-veloce con HMR
*   **Vanilla CSS**: Custom Design System con variabili CSS dinamiche
*   **LocalStorage**: Salvataggio locale della partita
*   **Express.js**: Backend per salvataggi remoti

## 🚀 Installazione

```bash
git clone git@github.com:pietrondo/oh-che-bel-castello.git
cd oh-che-bel-castello
npm install
npm run dev
```

### Backend (opzionale)
```bash
cd server
npm install
npm start
```

## 📦 Script Disponibili

```bash
npm run dev      # Avvia server di sviluppo
npm run build    # Compila per produzione
npm run lint     # Esegui linter
npm run preview  # Anteprima build produzione
```

## 🎮 Controlli

*   **Click su edificio**: Seleziona per costruire
*   **Click su mappa**: Posiziona edificio selezionato
*   **+/- su edificio**: Assegna/rimuovi lavoratori
*   **Click su edificio esistente**: Mostra pulsante upgrade
*   **Tab laterali**: Naviga tra Mappa, Ricerca, Economia, Corte

## 📝 Struttura Progetto

```
src/
├── components/         # Componenti React UI
│   ├── GameSetup.tsx   # Schermata setup iniziale
│   ├── MapWithEffects  # Mappa con edifici
│   ├── BuildingCard    # Card edificio
│   └── ...
├── game/               # Logica di gioco
│   ├── useGameEngine   # Hook principale
│   ├── buildingUpgrades# Configurazione upgrade
│   ├── apiClient       # Client API server
│   ├── types.ts        # Tipi TypeScript
│   └── constants.ts    # Costanti gioco
├── App.tsx             # Componente principale
└── App.css             # Stili principali
server/
├── index.js            # Server Express
└── saves/              # Cartella salvataggi
```

## 🎁 Bonus Regioni

| Regione | Bonus |
|---------|-------|
| Nord | +20% pietra, +15% ferro |
| Sud | +20% grano, +15% vino |
| Est | +20% legno, +15% conoscenza |
| Ovest | +20% oro, +15% commercio |
| Centrale | +10% tutte le risorse, +5 felicità |

## 🤝 Contribuire

1.  Fork del repository
2.  Crea un branch per la feature (`git checkout -b feature/nuova-funzionalita`)
3.  Commit delle modifiche (`git commit -m 'Aggiunta nuova funzionalità'`)
4.  Push sul branch (`git push origin feature/nuova-funzionalita`)
5.  Apri una Pull Request

## 📄 License

MIT License - vedi file LICENSE per dettagli

---

*Un regno non si costruisce solo con la pietra, ma con la saggezza.*
