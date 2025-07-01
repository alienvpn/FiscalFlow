
import type { VendorFormValues, RegistryFormValues, ContractFormValues, OpexItem, CapexItem, ApprovalItem, User, Group, Organization, Department, SubDepartment } from "@/lib/types";

// --- MOCK DATA (should be fetched from an API in a real app) ---

// This file is now the single source of truth for the application's data.
// To add or change data, edit the arrays below and redeploy the application.
// The master data pages are now read-only displays of this information.

export const groups: Group[] = [
  { id: "grp-root", name: "approotgroup" }
];

export const organizations: Organization[] = [
 { id: "org-root", name: "rootorg", groupId: "grp-root" }
];

export const departments: Department[] = [
 { id: "dept-root", name: "rootdepartment", organizationId: "org-root" }
];

export const subDepartments: SubDepartment[] = [
  { id: "sub-dept-root", name: "rootsubdepartment", departmentId: "dept-root" }
];

export const vendors: VendorFormValues[] = [
  // Add your vendors here.
];

export const registryItems: RegistryFormValues[] = [
  // Add your registry items (devices/services) here.
];

export const initialContracts: ContractFormValues[] = [
  // Add your contracts here.
];

export const opexSheets: {
  id: string;
  year: string;
  organizationId: string;
  departmentId: string;
  items: OpexItem[];
}[] = [
  // Add your OPEX sheets here.
];

export const capexSheets: {
  id: string;
  year: string;
  organizationId: string;
  departmentId: string;
  items: CapexItem[];
}[] = [
  // Add your CAPEX sheets here.
];

export const pendingApprovals: ApprovalItem[] = [
  // Add pending approval items here for display in the inbox.
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

export const mockUsers: User[] = [
  {
    id: 'user-root',
    groupId: 'grp-root',
    organizationId: 'org-root',
    departmentId: 'dept-root',
    subDepartmentId: 'sub-dept-root',
    username: 'rootuser',
    email: 'root@example.com',
    mobile: '1234567890',
    userRole: 'Administrator',
    password: 'rootuser26570',
    confirmPassword: 'rootuser26570',
    permissions: {
      '/master-data/company-profile': 'full',
      '/item-registry': 'full',
      '/master-data/vendors': 'full',
      '/capex-registry': 'full',
      '/opex-registry': 'full',
      '/contracts': 'full',
      '/approvals/inbox': 'full',
      '/reports': 'full',
      '/reports/capex': 'full',
      '/reports/opex': 'full',
      '/reports/contracts': 'full',
      '/reports/vendors': 'full',
      '/reports/user-access-rights': 'full',
      '/settings/approval-matrix': 'full',
      '/settings/user-registration': 'full',
      '/dashboard': 'full',
      '/capex-analysis': 'full',
      '/opex-tracker': 'full',
      '/budget-forecasting': 'full'
    },
  },
];
// --- END MOCK DATA ---
