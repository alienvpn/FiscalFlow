
// --- MOCK DATA (should be fetched from an API in a real app) ---

export const organizations = [
  { id: "org-1", name: "Qatar Branch" },
  { id: "org-2", name: "UAE Branch" },
];

export const departments = [
  { id: "dept-1", name: "IT Division", organizationId: "org-1" },
  { id: "dept-2", name: "Marketing Division", organizationId: "org-1" },
  { id: "dept-3", name: "HR Division", organizationId: "org-2" },
];

export const subDepartments = [
  { id: "sub-dept-1", name: "Infrastructure", departmentId: "dept-1" },
  { id: "sub-dept-2", name: "Software Development", departmentId: "dept-1" },
  { id: "sub-dept-3", name: "Digital Marketing", departmentId: "dept-2" },
  { id: "sub-dept-4", name: "Recruitment", departmentId: "dept-3" },
];

export const registryItems = [
    { id: "item-1", description: "Dell XPS 15 Laptop" },
    { id: "item-2", description: "AWS Cloud Hosting" },
    { id: "item-3", description: "Logitech MX Master 3S Mouse" },
];

export const vendors = [
  { id: "vendor-1", name: "Global Tech Supplies" },
  { id: "vendor-2", name: "Creative Solutions LLC" },
];

export const initialContracts = [
    {
        id: "con-1",
        contractDescription: "item-2",
        quantity: 1,
        supplierId: "vendor-1",
        mainDepartmentId: "dept-1", // IT -> Org 1
        subDepartmentId: "sub-dept-1",
        contractPeriod: "1 Year",
        contractAmount: 12000,
        paymentTerms: "Net 30",
        serviceStartDate: new Date("2024-01-01"),
        serviceEndDate: new Date("2024-12-31"),
    },
    {
        id: "con-2",
        contractDescription: "item-1",
        quantity: 1,
        supplierId: "vendor-2",
        mainDepartmentId: "dept-2", // Marketing -> Org 1
        subDepartmentId: "sub-dept-3",
        contractPeriod: "1 Year",
        contractAmount: 24000,
        paymentTerms: "Net 30",
        serviceStartDate: new Date("2024-05-01"),
        serviceEndDate: new Date("2025-04-30"),
    },
    {
        id: "con-3",
        contractDescription: "item-3",
        quantity: 1,
        supplierId: "vendor-1",
        mainDepartmentId: "dept-3", // HR -> Org 2
        subDepartmentId: "sub-dept-4",
        contractPeriod: "1 Year",
        contractAmount: 36000,
        paymentTerms: "Net 30",
        serviceStartDate: new Date("2023-11-01"),
        serviceEndDate: new Date("2024-10-31"),
    }
];
// --- END MOCK DATA ---
