
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { VendorFormValues, RegistryFormValues, ContractFormValues, OpexItem, CapexItem, ApprovalItem, User, Group, Organization, Department, SubDepartment } from "@/lib/types";

// Define the shape of the context data
interface DataContextProps {
  groups: Group[];
  setGroups: React.Dispatch<React.SetStateAction<Group[]>>;
  organizations: Organization[];
  setOrganizations: React.Dispatch<React.SetStateAction<Organization[]>>;
  departments: Department[];
  setDepartments: React.Dispatch<React.SetStateAction<Department[]>>;
  subDepartments: SubDepartment[];
  setSubDepartments: React.Dispatch<React.SetStateAction<SubDepartment[]>>;
  vendors: VendorFormValues[];
  setVendors: React.Dispatch<React.SetStateAction<VendorFormValues[]>>;
  registryItems: RegistryFormValues[];
  setRegistryItems: React.Dispatch<React.SetStateAction<RegistryFormValues[]>>;
  contracts: ContractFormValues[];
  setContracts: React.Dispatch<React.SetStateAction<ContractFormValues[]>>;
  opexSheets: any[]; // Define more specific type if needed
  setOpexSheets: React.Dispatch<React.SetStateAction<any[]>>;
  capexSheets: any[]; // Define more specific type if needed
  setCapexSheets: React.Dispatch<React.SetStateAction<any[]>>;
  pendingApprovals: ApprovalItem[];
  setPendingApprovals: React.Dispatch<React.SetStateAction<ApprovalItem[]>>;
  approvalWorkflows: any; // Define more specific type if needed
  setApprovalWorkflows: React.Dispatch<React.SetStateAction<any>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

// Create the context
const DataContext = createContext<DataContextProps | undefined>(undefined);

// Initial data that was in mock-data.ts
const initialGroups: Group[] = [{ id: "grp-root", name: "approotgroup" }];
const initialOrganizations: Organization[] = [{ id: "org-root", name: "rootorg", groupId: "grp-root" }];
const initialDepartments: Department[] = [{ id: "dept-root", name: "rootdepartment", organizationId: "org-root" }];
const initialSubDepartments: SubDepartment[] = [{ id: "sub-dept-root", name: "rootsubdepartment", departmentId: "dept-root" }];
const initialApprovalWorkflows = {
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
const initialUsers: User[] = [
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


// Create the provider component
export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [organizations, setOrganizations] = useState<Organization[]>(initialOrganizations);
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [subDepartments, setSubDepartments] = useState<SubDepartment[]>(initialSubDepartments);
  const [vendors, setVendors] = useState<VendorFormValues[]>([]);
  const [registryItems, setRegistryItems] = useState<RegistryFormValues[]>([]);
  const [contracts, setContracts] = useState<ContractFormValues[]>([]);
  const [opexSheets, setOpexSheets] = useState<any[]>([]);
  const [capexSheets, setCapexSheets] = useState<any[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<ApprovalItem[]>([]);
  const [approvalWorkflows, setApprovalWorkflows] = useState<any>(initialApprovalWorkflows);
  const [users, setUsers] = useState<User[]>(initialUsers);

  const value = {
    groups, setGroups,
    organizations, setOrganizations,
    departments, setDepartments,
    subDepartments, setSubDepartments,
    vendors, setVendors,
    registryItems, setRegistryItems,
    contracts, setContracts,
    opexSheets, setOpexSheets,
    capexSheets, setCapexSheets,
    pendingApprovals, setPendingApprovals,
    approvalWorkflows, setApprovalWorkflows,
    users, setUsers,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// Create a custom hook to use the context
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
