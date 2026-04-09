# 🏰 oh che bel castello

Un RTS gestionale medievale avanzato per browser, dove vesti i panni di un sovrano incaricato di trasformare un piccolo mastio in un fiorente impero.

## 🌟 Caratteristiche

### 🎮 Gameplay
*   **Gestionale in Tempo Reale**: Costruisci edifici, gestisci risorse e sviluppa il tuo regno
*   **Sistema di Costruzione**: Clicca su un edificio e posizionalo sulla mappa
*   **Assegnazione Lavoratori**: Ogni edificio produttivo può avere lavoratori assegnati
*   **Ricerca Tecnologica**: Sblocca avanzamenti in Economia, Scienza, Militare e Sociale

### 💎 Design System
*   **Interfaccia Desktop**: Navigazione verticale a sinistra per un'esperienza immersiva
*   **HUD Dinamico**: Monitora risorse, popolazione, difesa e anno di gioco
*   **Sidebar Costruzioni**: Edifici organizzati in categorie (Base, Industria, Corte)
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

## 🏗️ Edifici Disponibili

### Base
| Edificio | Costo | Produzione | Lavoratori |
|----------|-------|------------|------------|
| Casa | 30 Legno | +8 Popolazione | 0 |
| Fattoria | 20 Legno | 10 Grano | 3 |
| Segheria | 10 Legno, 5 Pietra | 12 Legno | 2 |
| Cava | 40 Legno | 10 Pietra | 3 |
| Pozzo | 50 Pietra | +Salute | 0 |
| Strada | 5 Legno | - | 0 |

### Industria
| Edificio | Costo | Produzione | Lavoratori |
|----------|-------|------------|------------|
| Mulino | 80 Legno, 40 Pietra | 8 Farina (-8 Grano) | 2 |
| Forno | 100 Pietra, 50 Oro | 12 Pane (-6 Farina) | 2 |
| Fabbro | 50 Legno, 50 Pietra, 50 Oro | 2 Attrezzi (-3 Ferro, -2 Legno) | 2 |
| Miniera | 60 Legno, 30 Pietra | 5 Ferro | 4 |

### Corte
| Edificio | Costo | Produzione | Lavoratori |
|----------|-------|------------|------------|
| Mastio Reale | 500 Oro, 300 Pietra | 10 Oro, 2 Prestigio, 1 Conoscenza | 0 |
| Caserma | 150 Pietra, 100 Oro | +Difesa | 8 |
| Università | 200 Pietra, 200 Oro | 8 Conoscenza | 4 |
| Chiesa | 100 Pietra, 50 Legno | 3 Pietà | 1 |
| Cattedrale | 800 Pietra, 1000 Oro | 15 Pietà, 10 Prestigio | 6 |

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

## 🛠️ Tecnologie

*   **React 18** + **TypeScript**: Tipizzazione statica e componenti moderni
*   **Vite**: Build tool ultra-veloce con HMR
*   **Vanilla CSS**: Custom Design System con variabili CSS dinamiche
*   **LocalStorage**: Salvataggio automatico della partita

## 🚀 Installazione

```bash
git clone git@github.com:pietrondo/oh-che-bel-castello.git
cd oh-che-bel-castello
npm install
npm run dev
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
*   **Tab laterali**: Naviga tra Mappa, Ricerca, Economia, Corte

## 📝 Struttura Progetto

```
src/
├── components/     # Componenti React UI
├── game/           # Logica di gioco (engine, tipi, costanti)
├── App.tsx         # Componente principale
├── App.css         # Stili principali
└── index.css       # Stili globali
```

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
