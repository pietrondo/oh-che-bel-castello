import type { GameEvent, EventChoice } from './types';

export const DYNAMIC_EVENTS: Omit<GameEvent, 'turn'>[] = [
  {
    id: 'peasant_revolt',
    title: '🔱 Rivolta dei Contadini',
    description: 'I contadini si ribellano alle tasse eccessive! Marciano verso il castello chiedendo giustizia.',
    type: 'crisis',
    image: '🔱',
    choices: [
      {
        id: 'repress',
        text: 'Reprimi la rivolta',
        description: 'Usa la forza per disperdere i ribelli',
        requirements: { gold: 50 },
        effects: {
          happiness: -20,
          population: -30,
          defense: -10,
          resources: { gold: -50 }
        },
        probability: 1
      },
      {
        id: 'negotiate',
        text: 'Negozia',
        description: 'Ascolta le loro richieste e riduci le tasse',
        effects: {
          happiness: 10,
          resources: { gold: -30, food: -50 },
          factionFavor: [{ faction: 'merchants', delta: -10 }]
        },
        probability: 2
      },
      {
        id: 'ignore',
        text: 'Ignora',
        description: 'Resta nei tuoi appartamenti, passerà',
        effects: {
          happiness: -30,
          population: -50,
          health: -10
        },
        probability: 1
      }
    ]
  },
  {
    id: 'merchant_guild_offer',
    title: '💰 Offerta della Gilda',
    description: 'La Gilda dei Mercanti offre un prestito generoso in cambio di privilegi commerciali.',
    type: 'opportunity',
    image: '💰',
    choices: [
      {
        id: 'accept',
        text: 'Accetta il prestito',
        description: '+200 oro, -10 favori mercanti, debito aumentato',
        effects: {
          resources: { gold: 200 },
          factionFavor: [{ faction: 'merchants', delta: -10 }]
        },
        probability: 2
      },
      {
        id: 'decline',
        text: 'Rifiuta',
        description: 'Mantieni la tua indipendenza',
        effects: {
          factionFavor: [{ faction: 'merchants', delta: 15 }],
          resources: { prestige: 10 }
        },
        probability: 1
      },
      {
        id: 'counteroffer',
        text: 'Controfferta',
        description: 'Proponi termini più favorevoli',
        requirements: { prestige: 30 },
        effects: {
          resources: { gold: 150 },
          factionFavor: [{ faction: 'merchants', delta: 5 }]
        },
        probability: 1
      }
    ]
  },
  {
    id: 'plague_outbreak',
    title: '🦀 Epidemia di Peste',
    description: 'Una malattia si diffonde rapidamente nel regno. I cittadini muoiono a centinaia.',
    type: 'crisis',
    image: '🦀',
    choices: [
      {
        id: 'quarantine',
        text: 'Metti in quarantena',
        description: 'Isola le zone colpite',
        requirements: { gold: 100 },
        effects: {
          population: -20,
          health: -10,
          happiness: -15,
          resources: { gold: -100 }
        },
        probability: 2
      },
      {
        id: 'prayers',
        text: 'Preghiere pubbliche',
        description: 'Organizza processioni religiose',
        effects: {
          population: -50,
          health: -20,
          resources: { piety: 20 }
        },
        probability: 1
      },
      {
        id: 'healers',
        text: 'Assumi guaritori',
        description: 'Paga medici e erboristi',
        requirements: { gold: 200, knowledge: 30 },
        effects: {
          population: -10,
          health: 5,
          happiness: 10,
          resources: { gold: -200 }
        },
        probability: 1
      }
    ]
  },
  {
    id: 'foreign_diplomat',
    title: '🏛️ Visitatore Straniero',
    description: 'Un ambasciatore di un regno lontano chiede udienza. Porta doni e proposte.',
    type: 'opportunity',
    image: '🏛️',
    choices: [
      {
        id: 'welcome',
        text: 'Accogli con onore',
        description: 'Organizza un banchetto sontuoso',
        requirements: { gold: 100, food: 150 },
        effects: {
          relations: [{ kingdom: 'Francia', delta: 25 }],
          happiness: 10,
          resources: { gold: -100, food: -150, prestige: 15 }
        },
        probability: 2
      },
      {
        id: 'receive',
        text: 'Ricevi normalmente',
        description: 'Udienza standard',
        effects: {
          relations: [{ kingdom: 'Francia', delta: 10 }],
          resources: { gold: -20 }
        },
        probability: 2
      },
      {
        id: 'dismiss',
        text: 'Congedisci',
        description: 'Sei troppo occupato per visitatori',
        effects: {
          relations: [{ kingdom: 'Francia', delta: -20 }],
          resources: { gold: 30 }
        },
        probability: 1
      }
    ]
  },
  {
    id: 'noble_conspiracy',
    title: '🗡️ Cospirazione Nobiliare',
    description: 'Una fazione di nobili trama alle tue spalle. Vogliono più potere.',
    type: 'crisis',
    image: '🗡️',
    choices: [
      {
        id: 'execute',
        text: 'Esegui i cospiratori',
        description: 'Mostra la tua autorità',
        requirements: { defense: 50 },
        effects: {
          happiness: -10,
          resources: { gold: 50, prestige: 20 },
          factionFavor: [{ faction: 'military', delta: 15 }, { faction: 'merchants', delta: -10 }]
        },
        probability: 1
      },
      {
        id: 'exile',
        text: 'Esilia i nobili',
        description: 'Confisca i loro beni e bandiscili',
        effects: {
          happiness: 5,
          resources: { gold: 100 },
          factionFavor: [{ faction: 'merchants', delta: 10 }]
        },
        probability: 2
      },
      {
        id: 'forgive',
        text: 'Perdona',
        description: 'Mostra clemenza reale',
        effects: {
          happiness: 15,
          health: 5,
          resources: { piety: 15 },
          factionFavor: [{ faction: 'clergy', delta: 10 }]
        },
        probability: 1
      }
    ]
  },
  {
    id: 'bountiful_harvest',
    title: '🌾 Raccolto Straordinario',
    description: 'I contadini riportano il miglior raccolto da decenni. I granai sono colmi.',
    type: 'positive',
    image: '🌾',
    choices: [
      {
        id: 'store',
        text: 'Immagazzina',
        description: 'Conserva per l\'inverno',
        effects: {
          resources: { food: 300, grain: 200 },
          happiness: 5
        },
        probability: 2
      },
      {
        id: 'distribute',
        text: 'Distribuisci al popolo',
        description: 'Organizza banchetti pubblici',
        effects: {
          happiness: 25,
          health: 10,
          resources: { food: 150, prestige: 20 }
        },
        probability: 2
      },
      {
        id: 'sell',
        text: 'Vendi l\'eccesso',
        description: 'Commercia con regni vicini',
        effects: {
          resources: { gold: 250, food: 100 },
          factionFavor: [{ faction: 'merchants', delta: 15 }]
        },
        probability: 1
      }
    ]
  },
  {
    id: 'religious_vision',
    title: '⛪ Visione Divina',
    description: 'Il tuo confessore riporta una visione profetica. Dio parla al tuo regno.',
    type: 'opportunity',
    image: '⛪',
    choices: [
      {
        id: 'temple',
        text: 'Costruisci un tempio',
        description: 'Onora la visione con una chiesa',
        requirements: { gold: 300, stone: 100 },
        effects: {
          resources: { gold: -300, stone: -100, piety: 50 },
          happiness: 15,
          factionFavor: [{ faction: 'clergy', delta: 25 }]
        },
        probability: 1
      },
      {
        id: 'pilgrimage',
        text: 'Pellegrinaggio',
        description: 'Viaggia verso il luogo sacro',
        requirements: { gold: 100 },
        effects: {
          resources: { gold: -100, piety: 30 },
          happiness: 10
        },
        probability: 2
      },
      {
        id: 'ignore',
        text: 'Scetticismo',
        description: 'Le visioni sono sogni',
        effects: {
          resources: { gold: 20 },
          factionFavor: [{ faction: 'clergy', delta: -20 }]
        },
        probability: 1
      }
    ]
  },
  {
    id: 'bandit_raids',
    title: '🗡️ Incursioni di Briganti',
    description: 'Bande di fuorilegge attaccano i villaggi di confine. I mercanti chiedono protezione.',
    type: 'negative',
    image: '🗡️',
    choices: [
      {
        id: 'hunt',
        text: 'Caccia i briganti',
        description: 'Invia le guardie',
        requirements: { defense: 30 },
        effects: {
          resources: { gold: -50 },
          happiness: 10,
          factionFavor: [{ faction: 'military', delta: 10 }]
        },
        probability: 2
      },
      {
        id: 'bounty',
        text: 'Taglia sulla testa',
        description: 'Offri oro per le loro teste',
        requirements: { gold: 100 },
        effects: {
          resources: { gold: -100 },
          happiness: 5
        },
        probability: 1
      },
      {
        id: 'recruit',
        text: 'Assoldali',
        description: 'Uniscili al tuo esercito',
        effects: {
          defense: 15,
          happiness: -10,
          factionFavor: [{ faction: 'military', delta: 15 }]
        },
        probability: 1
      }
    ]
  },
  {
    id: 'scholar_discovery',
    title: '📚 Scoperta dello Studioso',
    description: 'Un erudito dell\'università ha fatto una scoperta rivoluzionaria.',
    type: 'positive',
    image: '📚',
    choices: [
      {
        id: 'fund',
        text: 'Finanzia la ricerca',
        description: 'Investi nella scoperta',
        requirements: { gold: 150 },
        effects: {
          resources: { gold: -150, knowledge: 80 },
          factionFavor: [{ faction: 'merchants', delta: 5 }]
        },
        probability: 2
      },
      {
        id: 'publish',
        text: 'Pubblica',
        description: 'Condividi la conoscenza',
        effects: {
          resources: { knowledge: 40, prestige: 20 }
        },
        probability: 2
      },
      {
        id: 'secrecy',
        text: 'Mantieni il segreto',
        description: 'Solo tu devi sapere',
        effects: {
          resources: { knowledge: 60, gold: 50 },
          happiness: -5
        },
        probability: 1
      }
    ]
  },
  {
    id: 'harsh_winter',
    title: '❄️ Inverno Rigido',
    description: 'L\'inverno più freddo da decenni. I fiumi ghiacciano, il bestiame muore.',
    type: 'crisis',
    image: '❄️',
    choices: [
      {
        id: 'import',
        text: 'Importa cibo',
        description: 'Compra da regni lontani',
        requirements: { gold: 200 },
        effects: {
          resources: { gold: -200, food: 200 },
          happiness: 10
        },
        probability: 2
      },
      {
        id: 'ration',
        text: 'Raziona',
        description: 'Distribuisci equamente le scorte',
        effects: {
          happiness: -15,
          health: -5,
          population: -20
        },
        probability: 2
      },
      {
        id: 'prayers',
        text: 'Chiedi aiuto divino',
        description: 'Digiuno e preghiere',
        effects: {
          resources: { piety: 30 },
          happiness: -10,
          health: -10,
          population: -30
        },
        probability: 1
      }
    ]
  },
  {
    id: 'heir_birth',
    title: '👶 Nascita dell\'Erede',
    description: 'La regina ha dato alla luce un erede! La dinastia è al sicuro per il futuro.',
    type: 'positive',
    image: '👶',
    choices: [
      {
        id: 'celebrate',
        text: 'Celebra con festeggiamenti',
        description: 'Organizza banchetti in tutto il regno',
        requirements: { gold: 100, food: 150 },
        effects: {
          happiness: 20,
          resources: { gold: -100, food: -150, prestige: 25 }
        },
        probability: 2
      },
      {
        id: 'private_ceremony',
        text: 'Cerimonia privata',
        description: 'Una celebrazione intima con la famiglia reale',
        effects: {
          happiness: 5,
          resources: { prestige: 10 }
        },
        probability: 2
      },
      {
        id: 'ignore',
        text: 'Ignora',
        description: 'Hai già troppi figli',
        effects: {
          factionFavor: [{ faction: 'clergy', delta: -10 }]
        },
        probability: 1
      }
    ]
  },
  {
    id: 'sovereign_illness',
    title: '🤒 Malattia del Sovrano',
    description: 'Il sovrano è gravemente malato. Il regno trema per il futuro.',
    type: 'crisis',
    image: '🤒',
    choices: [
      {
        id: 'best_doctors',
        text: 'Migliori medici',
        description: 'Assumi i migliori guaritori del regno',
        requirements: { gold: 200, knowledge: 50 },
        effects: {
          health: 15,
          resources: { gold: -200, knowledge: -50 }
        },
        probability: 2
      },
      {
        id: 'religious_healing',
        text: 'Guarigione religiosa',
        description: 'Prega per la guarigione divina',
        effects: {
          resources: { piety: 30 },
          health: 5
        },
        probability: 2
      },
      {
        id: 'prepare_succession',
        text: 'Prepara la successione',
        description: 'Inizia a preparare l\'erede al trono',
        effects: {
          factionFavor: [{ faction: 'nobles', delta: 15 }],
          resources: { prestige: 20 }
        },
        probability: 1
      }
    ]
  },
  {
    id: 'succession_crisis',
    title: '👑 Crisi di Successione',
    description: 'Il sovrano è morto senza eredi chiari! Più pretendenti rivendicano il trono.',
    type: 'crisis',
    image: '👑',
    choices: [
      {
        id: 'support_favorite',
        text: 'Sostieni il favorito',
        description: 'Appoggia il pretendente che preferisci',
        requirements: { gold: 300 },
        effects: {
          resources: { gold: -300 },
          factionFavor: [{ faction: 'military', delta: 20 }],
          conspiracyChance: 0.1
        },
        probability: 1
      },
      {
        id: 'call_council',
        text: 'Consiglio dei nobili',
        description: 'Lascia decidere ai nobili',
        effects: {
          factionFavor: [{ faction: 'nobles', delta: 25 }],
          happiness: -10
        },
        probability: 2
      },
      {
        id: 'elective_monarchy',
        text: 'Monarchia elettiva',
        description: 'Instaura un sistema elettivo',
        effects: {
          resources: { prestige: 40 },
          factionFavor: [{ faction: 'merchants', delta: 15 }, { faction: 'clergy', delta: 15 }],
          successionLaw: 'elective'
        },
        probability: 1
      }
    ]
  },
  {
    id: 'heir_coming_of_age',
    title: '🎓 Maggiore Età dell\'Erede',
    description: 'L\'erede al trono ha raggiunto la maggiore età. È tempo di prepararlo al governo.',
    type: 'opportunity',
    image: '🎓',
    choices: [
      {
        id: 'tutoring',
        text: 'Tutoraggio intensivo',
        description: 'Assumi i migliori tutori',
        requirements: { gold: 150, knowledge: 30 },
        effects: {
          resources: { gold: -150, knowledge: -30 },
          factionFavor: [{ faction: 'scholars', delta: 20 }]
        },
        probability: 2
      },
      {
        id: 'diplomatic_experience',
        text: 'Esperienza diplomatica',
        description: 'Invialo in missioni diplomatiche',
        effects: {
          relations: [{ kingdom: 'Francia', delta: 15 }],
          factionFavor: [{ faction: 'diplomats', delta: 15 }]
        },
        probability: 2
      },
      {
        id: 'military_training',
        text: 'Addestramento militare',
        description: 'Affidalo all\'esercito per l\'addestramento',
        effects: {
          defense: 10,
          factionFavor: [{ faction: 'military', delta: 20 }]
        },
        probability: 1
      }
    ]
  },
  {
    id: 'dynasty_marriage',
    title: '💍 Matrimonio Dinastico',
    description: 'Un\'altra dinastia propone un matrimonio per unire le case reali.',
    type: 'opportunity',
    image: '💍',
    choices: [
      {
        id: 'accept_marriage',
        text: 'Accetta il matrimonio',
        description: 'Unisciti alla dinastia straniera',
        effects: {
          relations: [{ kingdom: 'Spagna', delta: 30 }],
          resources: { gold: 200, prestige: 30 }
        },
        probability: 2
      },
      {
        id: 'refuse_politely',
        text: 'Rifiuta educatamente',
        description: 'Declina con diplomazia',
        effects: {
          relations: [{ kingdom: 'Spagna', delta: -10 }],
          happiness: 5
        },
        probability: 2
      },
      {
        id: 'counter_proposal',
        text: 'Controproposta',
        description: 'Proponi un altro membro della famiglia',
        requirements: { prestige: 40 },
        effects: {
          relations: [{ kingdom: 'Spagna', delta: 15 }],
          resources: { prestige: 20 }
        },
        probability: 1
      }
    ]
  },
  {
    id: 'pretender_threat',
    title: '⚔️ Minaccia del Pretendente',
    description: 'Un pretendente al trono sta radunando sostenitori per sfidare la tua dinastia.',
    type: 'negative',
    image: '⚔️',
    choices: [
      {
        id: 'assassinate',
        text: 'Assassina il pretendente',
        description: 'Elimina la minaccia permanentemente',
        requirements: { gold: 200 },
        effects: {
          resources: { gold: -200 },
          factionFavor: [{ faction: 'military', delta: 10 }],
          conspiracyChance: 0.15
        },
        probability: 1
      },
      {
        id: 'exile',
        text: 'Esilia il pretendente',
        description: 'Bandiscilo dal regno',
        effects: {
          factionFavor: [{ faction: 'nobles', delta: -10 }],
          relations: [{ kingdom: 'Inghilterra', delta: -15 }]
        },
        probability: 2
      },
      {
        id: 'marriage_alliance',
        text: 'Alleanza matrimoniale',
        description: 'Sposalo/a a un tuo parente',
        requirements: { gold: 300, prestige: 50 },
        effects: {
          resources: { gold: -300, prestige: -50 },
          relations: [{ kingdom: 'Inghilterra', delta: 25 }],
          factionFavor: [{ faction: 'nobles', delta: 15 }]
        },
        probability: 1
      }
    ]
  },
  {
    id: 'court_betrayal',
    title: '🗡️ Tradimento a Corte',
    description: 'Il tuo consigliere più fidato è stato sorpreso a trattare con il nemico! Tutti chiedono giustizia.',
    type: 'crisis',
    image: '🗡️',
    choices: [
      {
        id: 'execute',
        text: 'Esecuzione pubblica',
        description: 'Decapitalo nella piazza del castello',
        effects: {
          happiness: -5,
          resources: { prestige: 15 },
          factionFavor: [{ faction: 'military', delta: 10 }, { faction: 'clergy', delta: -5 }],
          conspiracyChance: -0.1
        },
        probability: 2
      },
      {
        id: 'imprison',
        text: 'Imprigiona',
        description: 'Chiudilo nelle segrete',
        effects: {
          happiness: 5,
          health: -5,
          factionFavor: [{ faction: 'merchants', delta: -10 }],
          conspiracyChance: -0.05
        },
        probability: 2
      },
      {
        id: 'blackmail',
        text: 'Ricatta',
        description: 'Usa le sue informazioni contro di lui',
        requirements: { knowledge: 50 },
        effects: {
          resources: { gold: 150, knowledge: 30 },
          happiness: -10,
          factionFavor: [{ faction: 'merchants', delta: -15 }],
          conspiracyChance: 0.05
        },
        probability: 1
      }
    ]
  },
  {
    id: 'assassination_attempt',
    title: '🔪 Tentato Assassinio',
    description: 'Un sicario è penetrato nei tuoi appartamenti! Le guardie lo hanno fermato all\'ultimo.',
    type: 'crisis',
    image: '🔪',
    choices: [
      {
        id: 'interrogate',
        text: 'Interroga',
        description: 'Scopri chi lo ha mandato',
        requirements: { defense: 40 },
        effects: {
          resources: { knowledge: 40 },
          health: -10,
          factionFavor: [{ faction: 'military', delta: 15 }],
          conspiracyChance: -0.15
        },
        probability: 2
      },
      {
        id: 'execute_immediately',
        text: 'Esegui subito',
        description: 'Nessuna pietà per gli assassini',
        effects: {
          happiness: -10,
          resources: { prestige: 10 },
          factionFavor: [{ faction: 'military', delta: 5 }],
          conspiracyChance: -0.05
        },
        probability: 2
      },
      {
        id: 'false_flag',
        text: 'Usa come pretesto',
        description: 'Accusa un rivale (anche se innocente)',
        requirements: { prestige: 50 },
        effects: {
          resources: { gold: 100, prestige: 20 },
          happiness: -15,
          factionFavor: [{ faction: 'clergy', delta: -20 }],
          conspiracyChance: 0.1
        },
        probability: 1
      }
    ]
  },
  {
    id: 'secret_alliance',
    title: '🤝 Alleanza Segreta',
    description: 'Una fazione nobiliare ti propone un\'alleanza segreta per eliminare i tuoi nemici.',
    type: 'opportunity',
    image: '🤝',
    choices: [
      {
        id: 'accept',
        text: 'Accetta',
        description: 'Unitevi nell\'ombra',
        effects: {
          factionFavor: [{ faction: 'military', delta: 20 }, { faction: 'merchants', delta: -10 }],
          resources: { gold: 50 },
          happiness: -5,
          conspiracyChance: 0.05
        },
        probability: 1
      },
      {
        id: 'decline',
        text: 'Rifiuta',
        description: 'Non ti servono alleati segreti',
        effects: {
          factionFavor: [{ faction: 'military', delta: -15 }],
          resources: { prestige: 10 },
          happiness: 5
        },
        probability: 2
      },
      {
        id: 'counter_propose',
        text: 'Controproponi',
        description: 'Offri termini diversi',
        requirements: { prestige: 40 },
        effects: {
          factionFavor: [{ faction: 'military', delta: 10 }, { faction: 'merchants', delta: 10 }],
          resources: { gold: 30 },
          happiness: 5
        },
        probability: 2
      }
    ]
  },
  {
    id: 'poison_plot',
    title: '🧪 Complotto del Veleno',
    description: 'Le tue spie hanno scoperto un piano per avvelenarti durante il prossimo banchetto.',
    type: 'crisis',
    image: '🧪',
    choices: [
      {
        id: 'trap',
        text: 'Tendi una trappola',
        description: 'Fingi di non sapere e cogli sul fatto',
        requirements: { knowledge: 40 },
        effects: {
          resources: { knowledge: 30, prestige: 25 },
          factionFavor: [{ faction: 'military', delta: 10 }],
          happiness: 5,
          conspiracyChance: -0.2
        },
        probability: 1
      },
      {
        id: 'cancel_banquet',
        text: 'Annulla il banchetto',
        description: 'Meglio prevenire',
        effects: {
          happiness: -10,
          resources: { prestige: -10 },
          factionFavor: [{ faction: 'merchants', delta: -5 }],
          conspiracyChance: -0.05
        },
        probability: 2
      },
      {
        id: 'test_food',
        text: 'Assaggiatori reali',
        description: 'Aumenta le misure di sicurezza',
        effects: {
          health: 5,
          resources: { gold: -30 },
          happiness: 5,
          conspiracyChance: -0.1
        },
        probability: 2
      }
    ]
  },
  {
    id: 'favor_broker',
    title: '💼 Mediatore di Favori',
    description: 'Un mercante astuto offre di gestire i favori tra le fazioni per te.',
    type: 'opportunity',
    image: '💼',
    choices: [
      {
        id: 'hire',
        text: 'Assoldalo',
        description: 'Paga per i suoi servizi',
        requirements: { gold: 100 },
        effects: {
          resources: { gold: -100 },
          factionFavor: [{ faction: 'merchants', delta: 15 }, { faction: 'military', delta: 10 }, { faction: 'clergy', delta: 10 }],
          happiness: 5
        },
        probability: 2
      },
      {
        id: 'refuse',
        text: 'Rifiuta',
        description: 'Gestisci tu i favori',
        effects: {
          resources: { gold: 20 },
          factionFavor: [{ faction: 'merchants', delta: -5 }]
        },
        probability: 2
      },
      {
        id: 'threaten',
        text: 'Minaccia',
        description: 'Costringilo a lavorare gratis',
        requirements: { defense: 50 },
        effects: {
          factionFavor: [{ faction: 'merchants', delta: -20 }, { faction: 'military', delta: 5 }],
          happiness: -5,
          resources: { gold: 50 }
        },
        probability: 1
      }
    ]
  },
  {
    id: 'heir_scandal',
    title: '👑 Scandalo dell\'Erede',
    description: 'Il tuo erede è coinvolto in uno scandalo che potrebbe macchiare la dinastia.',
    type: 'negative',
    image: '👑',
    choices: [
      {
        id: 'cover_up',
        text: 'Insabbia',
        description: 'Usa oro per tacitare tutti',
        requirements: { gold: 150 },
        effects: {
          resources: { gold: -150 },
          happiness: -5,
          factionFavor: [{ faction: 'merchants', delta: -10 }]
        },
        probability: 2
      },
      {
        id: 'public_apology',
        text: 'Scuse pubbliche',
        description: 'L\'erede si scusa umilmente',
        effects: {
          happiness: 5,
          resources: { prestige: -15 },
          factionFavor: [{ faction: 'clergy', delta: 10 }]
        },
        probability: 2
      },
      {
        id: 'arrange_marriage',
        text: 'Matrimonio strategico',
        description: 'Sistema con un\'alleanza',
        effects: {
          resources: { gold: -50, prestige: 20 },
          factionFavor: [{ faction: 'military', delta: 15 }],
          happiness: -10
        },
        probability: 1
      }
    ]
  },
  {
    id: 'spy_network',
    title: '🕵️ Rete di Spie',
    description: 'Il tuo maestro delle spie propone di espandere la rete di intelligence.',
    type: 'opportunity',
    image: '🕵️',
    choices: [
      {
        id: 'expand',
        text: 'Espandi la rete',
        description: 'Investi in spie aggiuntive',
        requirements: { gold: 200 },
        effects: {
          resources: { gold: -200, knowledge: 100 },
          factionFavor: [{ faction: 'merchants', delta: -5 }],
          conspiracyChance: -0.15
        },
        probability: 2
      },
      {
        id: 'maintain',
        text: 'Mantieni',
        description: 'Continua come ora',
        effects: {
          resources: { gold: -20 },
          conspiracyChance: -0.05
        },
        probability: 2
      },
      {
        id: 'dismantle',
        text: 'Smantella',
        description: 'Le spie costano troppo',
        effects: {
          resources: { gold: 50 },
          happiness: 5,
          conspiracyChance: 0.1
        },
        probability: 1
      }
    ]
  },
  {
    id: 'excommunication_threat',
    title: '⛪ Minaccia di Scomunica',
    description: 'Il Papa minaccia di scomunicarti per le tue azioni contro la Chiesa. Le conseguenze potrebbero essere disastrose.',
    type: 'crisis',
    image: '⛪',
    choices: [
      {
        id: 'appease',
        text: 'Rassicura il Papa',
        description: 'Invia doni e prometti obbedienza',
        requirements: { gold: 200, piety: 20 },
        effects: {
          resources: { gold: -200, piety: 10 },
          factionFavor: [{ faction: 'clergy', delta: 20 }]
        },
        probability: 2
      },
      {
        id: 'defy',
        text: 'Sfida il Papa',
        description: 'Rifiuta di sottometterti alla sua autorità',
        requirements: { defense: 60, prestige: 50 },
        effects: {
          resources: { gold: 50, prestige: 15 },
          factionFavor: [{ faction: 'military', delta: 15 }, { faction: 'clergy', delta: -30 }],
          conspiracyChance: 0.1
        },
        probability: 1
      },
      {
        id: 'negotiate',
        text: 'Negozia',
        description: 'Manda ambasciatori a trattare',
        requirements: { knowledge: 40 },
        effects: {
          resources: { gold: -50, knowledge: -20 },
          factionFavor: [{ faction: 'clergy', delta: 5 }]
        },
        probability: 2
      }
    ]
  },
  {
    id: 'excommunication_major',
    title: '⚡ Scomunica Maggiore!',
    description: 'Sei stato scomunicato! I tuoi sudditi sono sciolti dal giuramento di fedeltà. Il regno trema.',
    type: 'crisis',
    image: '⚡',
    choices: [
      {
        id: 'public_penance',
        text: 'Pubblica penitenza',
        description: 'Umiliati davanti alla Chiesa',
        requirements: { piety: 30 },
        effects: {
          resources: { piety: -30, prestige: -20 },
          happiness: -15,
          factionFavor: [{ faction: 'clergy', delta: 25 }]
        },
        probability: 2
      },
      {
        id: 'bribe_bishop',
        text: 'Corrompi il Vescovo',
        description: 'Usa l\'oro per revocare la scomunica',
        requirements: { gold: 500 },
        effects: {
          resources: { gold: -500 },
          factionFavor: [{ faction: 'clergy', delta: -20 }, { faction: 'merchants', delta: -10 }],
          happiness: -10
        },
        probability: 1
      },
      {
        id: 'ignore',
        text: 'Ignora',
        description: 'La scomunica è solo carta straccia',
        effects: {
          happiness: -25,
          population: -30,
          factionFavor: [{ faction: 'military', delta: 10 }]
        },
        probability: 1
      }
    ]
  },
  {
    id: 'crusade_call',
    title: '✝️ Chiamata alla Crociata',
    description: 'Il Papa bandisce una crociata! Tutti i regni cristiani sono chiamati alle armi.',
    type: 'opportunity',
    image: '✝️',
    choices: [
      {
        id: 'join_crusade',
        text: 'Unisciti alla Crociata',
        description: 'Invia truppe e risorse in Terra Santa',
        requirements: { gold: 300, food: 200, defense: 40 },
        effects: {
          resources: { gold: -300, food: -200, piety: 80, prestige: 40 },
          factionFavor: [{ faction: 'clergy', delta: 30 }, { faction: 'military', delta: 10 }],
          happiness: -10
        },
        probability: 2
      },
      {
        id: 'fund_only',
        text: 'Finanzia solo',
        description: 'Contribuisci con oro ma non truppe',
        requirements: { gold: 200 },
        effects: {
          resources: { gold: -200, piety: 30 },
          factionFavor: [{ faction: 'clergy', delta: 15 }]
        },
        probability: 2
      },
      {
        id: 'refuse',
        text: 'Rifiuta',
        description: 'La tua guerra è qui, non in Oriente',
        effects: {
          factionFavor: [{ faction: 'clergy', delta: -25 }, { faction: 'military', delta: 5 }],
          resources: { gold: 30 }
        },
        probability: 1
      }
    ]
  },
  {
    id: 'miracle_reported',
    title: '✨ Mircolo Segnalato',
    description: 'Un miracolo è stato riportato nel tuo regno! I pellegrini accorrono in massa.',
    type: 'positive',
    image: '✨',
    choices: [
      {
        id: 'investigate',
        text: 'Investiga',
        description: 'Verifica l\'autenticità del miracolo',
        requirements: { knowledge: 30 },
        effects: {
          resources: { piety: 40, prestige: 20 },
          factionFavor: [{ faction: 'clergy', delta: 15 }],
          happiness: 10
        },
        probability: 2
      },
      {
        id: 'promote',
        text: 'Promuovi',
        description: 'Sfrutta il miracolo per il prestigio',
        effects: {
          resources: { piety: 25, prestige: 30, gold: 50 },
          factionFavor: [{ faction: 'clergy', delta: 10 }],
          happiness: 5
        },
        probability: 2
      },
      {
        id: 'dismiss',
        text: 'Ignora',
        description: 'Superstizioni da ignorare',
        effects: {
          factionFavor: [{ faction: 'clergy', delta: -10 }],
          resources: { gold: 20 }
        },
        probability: 1
      }
    ]
  },
  {
    id: 'heresy_spread',
    title: '📜 Eresia Diffusa',
    description: 'Dottrine eretiche si diffondono tra il popolo. Il clero chiede azione immediata.',
    type: 'negative',
    image: '📜',
    choices: [
      {
        id: 'inquisition',
        text: 'Inquisizione',
        description: 'Caccia e punisci gli eretici',
        requirements: { defense: 40 },
        effects: {
          resources: { gold: -100, piety: 20 },
          happiness: -20,
          factionFavor: [{ faction: 'clergy', delta: 25 }, { faction: 'military', delta: -5 }],
          conspiracyChance: 0.05
        },
        probability: 2
      },
      {
        id: 'debate',
        text: 'Dibattito pubblico',
        description: 'Confuta l\'eresia con la ragione',
        requirements: { knowledge: 50 },
        effects: {
          resources: { knowledge: -30, piety: 15 },
          happiness: 5,
          factionFavor: [{ faction: 'clergy', delta: 10 }]
        },
        probability: 2
      },
      {
        id: 'tolerate',
        text: 'Tollera',
        description: 'Permetti la libertà di pensiero',
        effects: {
          happiness: 10,
          factionFavor: [{ faction: 'clergy', delta: -30 }, { faction: 'merchants', delta: 10 }],
          conspiracyChance: 0.1
        },
        probability: 1
      }
    ]
  },
  {
    id: 'bishop_visit',
    title: '🎭 Visita del Vescovo',
    description: 'Un vescovo influente visita il tuo regno. Le sue parole possono rafforzare o indebolire la tua posizione.',
    type: 'opportunity',
    image: '🎭',
    choices: [
      {
        id: 'grand_reception',
        text: 'Grandiosa accoglienza',
        description: 'Organizza cerimonie sontuose',
        requirements: { gold: 150, food: 100 },
        effects: {
          resources: { gold: -150, food: -100, piety: 30, prestige: 20 },
          factionFavor: [{ faction: 'clergy', delta: 25 }],
          happiness: 10
        },
        probability: 2
      },
      {
        id: 'modest_reception',
        text: 'Accoglienza modesta',
        description: 'Tratta con rispetto ma senza eccessi',
        effects: {
          resources: { gold: -30, piety: 10 },
          factionFavor: [{ faction: 'clergy', delta: 10 }]
        },
        probability: 2
      },
      {
        id: 'cold_reception',
        text: 'Accoglienza fredda',
        description: 'Mostra indifferenza',
        effects: {
          resources: { gold: 20 },
          factionFavor: [{ faction: 'clergy', delta: -15 }, { faction: 'military', delta: 5 }]
        },
        probability: 1
      }
    ]
  },
  {
    id: 'religious_artifact',
    title: '🏺 Artefatto Religioso',
    description: 'Un mercante offre un antico artefatto religioso. Potrebbe avere grandi poteri... o essere una frode.',
    type: 'opportunity',
    image: '🏺',
    choices: [
      {
        id: 'buy_expensive',
        text: 'Acquista (prezzo alto)',
        description: 'Paga 200 oro per l\'artefatto',
        requirements: { gold: 200 },
        effects: {
          resources: { gold: -200, piety: 50, prestige: 20 },
          factionFavor: [{ faction: 'clergy', delta: 20 }],
          happiness: 10
        },
        probability: 1
      },
      {
        id: 'buy_cheap',
        text: 'Acquista (prezzo basso)',
        description: 'Offri 80 oro',
        requirements: { gold: 80 },
        effects: {
          resources: { gold: -80 },
          factionFavor: [{ faction: 'clergy', delta: -10 }],
          happiness: 5
        },
        probability: 2
      },
      {
        id: 'decline',
        text: 'Rifiuta',
        description: 'Non ti servono reliquie',
        effects: {
          resources: { gold: 10 }
        },
        probability: 2
      }
    ]
  },
  {
    id: 'monastery_foundation',
    title: '🏛️ Fondazione Monastero',
    description: 'Un ordine monastico chiede permesso per fondare un monastero nel tuo regno.',
    type: 'opportunity',
    image: '🏛️',
    choices: [
      {
        id: 'grant_land',
        text: 'Concedi terre',
        description: 'Dona terre e risorse per il monastero',
        requirements: { gold: 100, wood: 150 },
        effects: {
          resources: { gold: -100, wood: -150, piety: 40 },
          factionFavor: [{ faction: 'clergy', delta: 30 }],
          happiness: 15
        },
        probability: 2
      },
      {
        id: 'tax_exemption',
        text: 'Esenzione fiscale',
        description: 'Permetti il monastero senza tasse',
        effects: {
          resources: { piety: 20, gold: -20 },
          factionFavor: [{ faction: 'clergy', delta: 15 }]
        },
        probability: 2
      },
      {
        id: 'deny',
        text: 'Nega',
        description: 'Hai già troppi religiosi',
        effects: {
          resources: { gold: 30 },
          factionFavor: [{ faction: 'clergy', delta: -20 }]
        },
        probability: 1
      }
    ]
  },
  {
    id: 'papal_bull',
    title: '📯 Bolla Papale',
    description: 'Il Papa emette una bolla che influenza il tuo regno. Devi decidere come reagire.',
    type: 'neutral',
    image: '📯',
    choices: [
      {
        id: 'accept',
        text: 'Accetta',
        description: 'Obbedisci senza question',
        effects: {
          resources: { piety: 20 },
          factionFavor: [{ faction: 'clergy', delta: 15 }],
          happiness: -5
        },
        probability: 2
      },
      {
        id: 'petition',
        text: 'Presenta petizione',
        description: 'Chiedi modifiche alla bolla',
        requirements: { knowledge: 40, prestige: 30 },
        effects: {
          resources: { knowledge: -20, piety: 10 },
          factionFavor: [{ faction: 'clergy', delta: 5 }]
        },
        probability: 2
      },
      {
        id: 'resist',
        text: 'Resisti',
        description: 'Rifiuta pubblicamente la bolla',
        effects: {
          resources: { gold: 50, prestige: 15 },
          factionFavor: [{ faction: 'clergy', delta: -25 }, { faction: 'military', delta: 10 }],
          happiness: 5
        },
        probability: 1
      }
    ]
  },
  {
    id: 'saint_canonization',
    title: '🙌 Canonizzazione Santo',
    description: 'Un santo locale viene canonizzato! Il tuo regno è orgoglioso di questo onore.',
    type: 'positive',
    image: '🙌',
    choices: [
      {
        id: 'celebrate',
        text: 'Celebra',
        description: 'Organizza festeggiamenti in tutto il regno',
        requirements: { gold: 100, food: 100 },
        effects: {
          resources: { gold: -100, food: -100, piety: 40, prestige: 30 },
          factionFavor: [{ faction: 'clergy', delta: 20 }],
          happiness: 20
        },
        probability: 2
      },
      {
        id: 'shrine',
        text: 'Costruisci santuario',
        description: 'Erigi un santuario in onore del santo',
        requirements: { stone: 100, gold: 150 },
        effects: {
          resources: { stone: -100, gold: -150, piety: 60 },
          factionFavor: [{ faction: 'clergy', delta: 25 }],
          happiness: 10
        },
        probability: 1
      },
      {
        id: 'acknowledge',
        text: 'Riconosci',
        description: 'Accetta con gratitudine',
        effects: {
          resources: { piety: 20, prestige: 10 },
          factionFavor: [{ faction: 'clergy', delta: 10 }],
          happiness: 5
        },
        probability: 2
      }
    ]
  },
  {
    id: 'indulgence_sale',
    title: '💸 Vendita Indulgenze',
    description: 'La Chiesa offre indulgenze in cambio di donazioni generose.',
    type: 'opportunity',
    image: '💸',
    choices: [
      {
        id: 'buy_bulk',
        text: 'Acquista in massa',
        description: 'Spendi 250 oro per indulgenze',
        requirements: { gold: 250 },
        effects: {
          resources: { gold: -250, piety: 60 },
          factionFavor: [{ faction: 'clergy', delta: 20 }],
          happiness: 10
        },
        probability: 2
      },
      {
        id: 'buy_some',
        text: 'Acquista alcune',
        description: 'Spendi 80 oro',
        requirements: { gold: 80 },
        effects: {
          resources: { gold: -80, piety: 20 },
          factionFavor: [{ faction: 'clergy', delta: 10 }]
        },
        probability: 2
      },
      {
        id: 'refuse',
        text: 'Rifiuta',
        description: 'Le indulgenze sono una truffa',
        effects: {
          resources: { gold: 20 },
          factionFavor: [{ faction: 'clergy', delta: -15 }],
          happiness: 5
        },
        probability: 1
      }
    ]
  },
  {
    id: 'witch_trial',
    title: '🔥 Processo alle Streghe',
    description: 'Una donna è accusata di stregoneria. Il popolo chiede giustizia.',
    type: 'crisis',
    image: '🔥',
    choices: [
      {
        id: 'burn',
        text: 'Condanna al rogo',
        description: 'Esegui la presunta strega',
        requirements: { defense: 30 },
        effects: {
          resources: { piety: 15 },
          happiness: -10,
          factionFavor: [{ faction: 'clergy', delta: 15 }],
          conspiracyChance: 0.05
        },
        probability: 2
      },
      {
        id: 'acquit',
        text: 'Assolvi',
        description: 'Dichiara l\'innocenza',
        requirements: { knowledge: 30 },
        effects: {
          resources: { knowledge: -20 },
          happiness: 10,
          factionFavor: [{ faction: 'clergy', delta: -20 }]
        },
        probability: 1
      },
      {
        id: 'exile',
        text: 'Esilia',
        description: 'Bandisci dal regno',
        effects: {
          happiness: 5,
          factionFavor: [{ faction: 'clergy', delta: -5 }]
        },
        probability: 2
      }
    ]
  }
];

export function getEventById(id: string): Omit<GameEvent, 'turn'> | undefined {
  return DYNAMIC_EVENTS.find(e => e.id === id);
}

export function getRandomEvent(eventType?: 'positive' | 'negative' | 'neutral' | 'crisis' | 'opportunity'): Omit<GameEvent, 'turn'> {
  const filtered = eventType 
    ? DYNAMIC_EVENTS.filter(e => e.type === eventType)
    : DYNAMIC_EVENTS;
  
  if (filtered.length === 0) {
    return DYNAMIC_EVENTS[0];
  }
  
  const weights = filtered.map(e => {
    if (e.choices) {
      return e.choices.reduce((sum, c) => sum + (c.probability || 1), 0);
    }
    return 1;
  });
  
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < filtered.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return filtered[i];
    }
  }
  
  return filtered[filtered.length - 1];
}
