// --- MOCK DATA (should be fetched from an API in a real app) ---

export const groups = [{ id: "grp-1", name: "Global Tech Inc." }];

export const organizations = [
  { id: "org-1", name: "Qatar Branch", groupId: "grp-1" },
  { id: "org-2", name: "UAE Branch", groupId: "grp-1" },
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

export const vendors = [
    {
        id: "vendor-1",
        companyName: "Global Tech Supplies",
        address: "123 Tech Avenue",
        country: "United States",
        city: "Los Angeles",
        email: "contact@globaltech.com",
        telephone: "1-800-555-1234",
        fax: "",
        whatsapp: "",
        website: "https://globaltech.com",
        accountManager: {
            name: "John Doe",
            designation: "Senior Account Manager",
            email: "john.doe@globaltech.com",
            telephone: "1-800-555-1235",
            mobile: "1-408-555-6789",
            whatsapp: "",
        },
        techSupport1: { name: "", email: "", telephone: "", mobile: "" },
        techSupport2: { name: "", email: "", telephone: "", mobile: "" },
        techSupport3: { name: "", email: "", telephone: "", mobile: "" },
    },
    {
        id: "vendor-2",
        companyName: "Creative Solutions LLC",
        address: "456 Marketing Blvd",
        country: "United States",
        city: "New York City",
        email: "hello@creativesolutions.com",
        telephone: "1-212-555-5678",
        fax: "",
        whatsapp: "",
        website: "https://creativesolutions.com",
        accountManager: {
            name: "Jane Smith",
            designation: "Client Partner",
            email: "jane.s@creativesolutions.com",
            telephone: "1-212-555-5679",
            mobile: "1-917-555-1234",
            whatsapp: "",
        },
        techSupport1: { name: "", email: "", telephone: "", mobile: "" },
        techSupport2: { name: "", email: "", telephone: "", mobile: "" },
        techSupport3: { name: "", email: "", telephone: "", mobile: "" },
    }
];

export const registryItems = [
    {
        id: "item-1",
        type: "device" as const,
        deviceDescription: "Dell XPS 15 Laptop",
        model: "XPS 9530",
        make: "Dell",
        serialNumber: "SN-12345XYZ",
        warrantyStartDate: new Date("2023-01-15"),
        warrantyEndDate: new Date("2026-01-14"),
    },
    {
        id: "item-2",
        type: "service" as const,
        serviceDescription: "AWS Cloud Hosting",
        supplierId: "vendor-1",
        serviceStartDate: new Date("2024-01-01"),
        serviceEndDate: new Date("2025-01-01"),
    },
    {
        id: "item-3",
        type: "device" as const,
        deviceDescription: "Logitech MX Master 3S Mouse",
        model: "MX Master 3S",
        make: "Logitech",
        serialNumber: "SN-ABC9876",
    },
];

export const initialContracts = [
    {
        id: "con-1",
        contractDescription: "item-2",
        quantity: 1,
        supplierId: "vendor-1",
        mainDepartmentId: "dept-1",
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
        quantity: 10,
        supplierId: "vendor-1",
        mainDepartmentId: "dept-2",
        subDepartmentId: "sub-dept-3",
        contractPeriod: "1 Year",
        contractAmount: 85000,
        paymentTerms: "Net 30",
        serviceStartDate: new Date("2024-05-01"),
        serviceEndDate: new Date("2025-04-30"),
    },
    {
        id: "con-3",
        contractDescription: "item-3",
        quantity: 20,
        supplierId: "vendor-1",
        mainDepartmentId: "dept-3",
        subDepartmentId: "sub-dept-4",
        contractPeriod: "1 Year",
        contractAmount: 3600,
        paymentTerms: "Net 30",
        serviceStartDate: new Date("2023-08-01"),
        serviceEndDate: new Date("2024-07-25"), // Expiring soon
    }
];

export const opexSheets = [
  {
    year: (new Date().getFullYear() - 1).toString(),
    organizationId: 'org-1',
    departmentId: 'dept-1',
    items: [
      { id: 'prev-opex-item-1', description: 'Cloud Hosting - Previous Year', period: 'Monthly', amount: 3000, implementation: 'Ongoing', serviceStatus: 'Active', supplier: 'vendor-1', remarks: 'Standard cloud costs for IT Infra' },
      { id: 'prev-opex-item-2', description: 'CRM Subscription - Previous Year', period: 'Annually', amount: 18000, implementation: 'Renewal', serviceStatus: 'Active', supplier: 'vendor-2', remarks: 'Annual license for Sales' },
    ]
  },
  {
    year: (new Date().getFullYear() - 1).toString(),
    organizationId: 'org-1',
    departmentId: 'dept-2',
    items: [
      { id: 'prev-opex-item-3', description: 'Social Media Ads Budget', period: 'Monthly', amount: 5000, implementation: 'Ongoing', serviceStatus: 'Active', supplier: 'vendor-2', remarks: 'For marketing campaigns' },
    ]
  }
];

export const capexSheets = [
  {
    year: (new Date().getFullYear() - 1).toString(),
    organizationId: 'org-1',
    departmentId: 'dept-1',
    items: [
      { id: 'prev-capex-item-1', description: 'New Developer Laptops (10x)', priority: 'High', quantity: 10, amount: 6000, justification: 'To replace aging hardware for the development team', remarks: 'Model: MacBook Pro 16"' },
      { id: 'prev-capex-item-2', description: 'Office Server Upgrade', priority: 'Medium', quantity: 1, amount: 15000, justification: 'Increase storage and processing power', remarks: 'Dell PowerEdge R750' },
    ]
  },
  {
    year: (new Date().getFullYear() - 1).toString(),
    organizationId: 'org-1',
    departmentId: 'dept-2',
    items: [
      { id: 'prev-capex-item-3', description: 'Video Production Camera', priority: 'High', quantity: 1, amount: 12000, justification: 'For creating high-quality marketing content', remarks: 'Sony A7S III' },
    ]
  }
];
// --- END MOCK DATA ---
