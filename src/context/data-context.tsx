
"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { VendorFormValues, RegistryFormValues, ContractFormValues, OpexItem, CapexItem, ApprovalItem, User, Group, Organization, Department, SubDepartment } from "@/lib/types";

/**
 * A custom hook that uses localStorage for state persistence.
 * @param storageKey The key to use in localStorage.
 * @param fallbackState The initial state to use if nothing is in localStorage.
 * @returns A stateful value, and a function to update it.
 */
function usePersistentState<T>(storageKey: string, fallbackState: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(fallbackState);

  // This effect runs once on mount on the client-side to load data from localStorage.
  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(storageKey);
      if (storedValue) {
        // The reviver function is crucial for converting date strings back to Date objects.
        const parsedValue = JSON.parse(storedValue, (key, value) => {
          if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
            return new Date(value);
          }
          return value;
        });
        setValue(parsedValue);
      }
    } catch (e) {
      console.error(`Failed to parse stored value for ${storageKey}:`, e);
      // If parsing fails, we stick with the fallback state.
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // This effect saves the state to localStorage whenever it changes.
  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value));
    } catch (e) {
      console.error(`Failed to save value for ${storageKey} to localStorage:`, e);
    }
  }, [storageKey, value]);

  return [value, setValue];
}


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

// Default initial data if nothing is in localStorage
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
    userRole: 'Root User',
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
  {
    id: 'user-it-admin',
    groupId: 'grp-root',
    organizationId: 'org-root',
    departmentId: 'dept-root',
    subDepartmentId: 'sub-dept-root',
    username: 'itadmin',
    email: 'it.admin@example.com',
    mobile: '1234567891',
    userRole: 'IT Administrator',
    password: 'itadminpassword',
    confirmPassword: 'itadminpassword',
    permissions: {
      '/master-data/company-profile': 'read',
      '/item-registry': 'full',
      '/master-data/vendors': 'write',
      '/capex-registry': 'full',
      '/opex-registry': 'full',
      '/contracts': 'read',
      '/approvals/inbox': 'none',
      '/reports': 'read',
      '/reports/capex': 'read',
      '/reports/opex': 'read',
      '/reports/contracts': 'read',
      '/reports/vendors': 'read',
      '/reports/user-access-rights': 'read',
      '/settings/approval-matrix': 'none',
      '/settings/user-registration': 'none',
      '/dashboard': 'full',
      '/capex-analysis': 'full',
      '/opex-tracker': 'full',
      '/budget-forecasting': 'read'
    },
  },
];


// Create the provider component
export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [groups, setGroups] = usePersistentState<Group[]>('groups', initialGroups);
  const [organizations, setOrganizations] = usePersistentState<Organization[]>('organizations', initialOrganizations);
  const [departments, setDepartments] = usePersistentState<Department[]>('departments', initialDepartments);
  const [subDepartments, setSubDepartments] = usePersistentState<SubDepartment[]>('subDepartments', initialSubDepartments);
  const [vendors, setVendors] = usePersistentState<VendorFormValues[]>('vendors', []);
  const [registryItems, setRegistryItems] = usePersistentState<RegistryFormValues[]>('registryItems', []);
  const [contracts, setContracts] = usePersistentState<ContractFormValues[]>('contracts', []);
  const [opexSheets, setOpexSheets] = usePersistentState<any[]>('opexSheets', []);
  const [capexSheets, setCapexSheets] = usePersistentState<any[]>('capexSheets', []);
  const [pendingApprovals, setPendingApprovals] = usePersistentState<ApprovalItem[]>('pendingApprovals', []);
  const [approvalWorkflows, setApprovalWorkflows] = usePersistentState<any>('approvalWorkflows', initialApprovalWorkflows);
  const [users, setUsers] = usePersistentState<User[]>('users', initialUsers);

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
