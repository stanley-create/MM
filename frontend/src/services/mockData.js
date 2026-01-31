// Enhanced Mock Data for MoneyQuest V2

export const MOCK_QUESTS = [
    { id: 'q1', title: 'Taipei Commuter', description: 'Use MRT/Bus 5 times this week.', target: 5, progress: 2, reward_exp: 150 },
    { id: 'q2', title: 'Night Market Hero', description: 'Log 3 food expenses < $150 NTD.', target: 3, progress: 1, reward_exp: 100 },
];

export const MOCK_GUILD_MSG = [
    { id: '1', user: 'ForestGuardian', text: 'Welcome directly from Banqiao District!', type: 'chat' },
    { id: '2', user: 'EcoMage', text: 'Has anyone seen the rare QR Code monster?', type: 'chat' }
];

export const MOCK_ANALYSIS = {
    summary: "Your spending is balanced.",
    npc_persona: "Elder", // or Scholar
    message: "HHo ho! As the Elder sees it, your gold is well kept. But beware the temptations of the Weekend Dragon!"
};
