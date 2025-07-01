// --- MOCK DATA (should be fetched from an API in a real app) ---

// To get started, manually enter your own data here.
// For a production app, this data would typically be stored in a database.

export const groups = [
  // Example: { id: "grp-1", name: "Your Holding Group" }
];

export const organizations = [
  // Example: { id: "org-1", name: "Your Company Name", groupId: "grp-1" }
];

export const departments = [
  // Example: { id: "dept-1", name: "Your Department", organizationId: "org-1" }
];

export const subDepartments = [
  // Example: { id: "sub-dept-1", name: "Your Sub-Department", departmentId: "dept-1" }
];

export const vendors = [
  // Example of a vendor object can be found in the vendors page component.
  // You can add your vendors here.
];

export const registryItems = [
  // Example of a registry item can be found in the item registry page component.
];

export const initialContracts = [
  // Example of a contract object can be found in the contracts page component.
];

export const opexSheets = [
  // Example data has been cleared.
];

export const capexSheets = [
  // Example data has been cleared.
];

export const pendingApprovals = [
  // Example data has been cleared.
];

export const approvalWorkflows = {
  budget: [
    { id: 'level-1', level: 1, approverRole: 'Department Head', description: 'Initial review and approval by the head of the requesting department.' },
    { id: 'level-2', level: 2, approverRole: 'Finance Manager', description: 'Financial review for budget alignment and accuracy.' },
    { id: 'level-3', level: 3, approverRole: 'General Manager', description: 'Operational approval for strategic alignment.' },
    { id: 'level-4', level: 4, approverRole: 'Director of Finance', description: 'Final financial sign-off for all expenditures.' },
  ],
  contract: [
    { id: 'contract-level-1', level: 1, approverRole: 'Contract Manager', description: 'Initial review of contract renewal terms.' },
    { id: 'contract-level-2', level: 2, approverRole: 'Legal Advisor', description: 'Legal review of contract clauses.' },
    { id: 'contract-level-3', level: 3, approverRole: 'Finance Director', description: 'Final financial approval for renewal.' },
  ]
};

export const mockUsers = [
  // Example data has been cleared. You can create users via the User Registration page.
];
// --- END MOCK DATA ---
