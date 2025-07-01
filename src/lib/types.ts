
import { z } from "zod";

// From /master-data/vendors/page.tsx
export const vendorSchema = z.object({
  id: z.string().optional(),
  companyName: z.string().min(1, "Company Name is required."),
  address: z.string().min(1, "Address is required."),
  country: z.string().min(1, "Country is required."),
  city: z.string().min(1, "City is required."),
  email: z.string().email("Invalid email address."),
  telephone: z.string().min(1, "Telephone is required."),
  fax: z.string().optional(),
  whatsapp: z.string().optional(),
  website: z.string().url("Invalid URL.").optional().or(z.literal("")),
  accountManager: z.object({
    name: z.string().min(1, "Name is required."),
    designation: z.string().min(1, "Designation is required."),
    email: z.string().email("Invalid email address."),
    telephone: z.string().min(1, "Telephone is required."),
    mobile: z.string().min(1, "Mobile is required."),
    whatsapp: z.string().optional(),
  }),
  techSupport1: z.object({
    name: z.string().optional(),
    email: z.string().email("Invalid email.").optional().or(z.literal("")),
    telephone: z.string().optional(),
    mobile: z.string().optional(),
  }),
  techSupport2: z.object({
    name: z.string().optional(),
    email: z.string().email("Invalid email.").optional().or(z.literal("")),
    telephone: z.string().optional(),
    mobile: z.string().optional(),
  }),
  techSupport3: z.object({
    name: z.string().optional(),
    email: z.string().email("Invalid email.").optional().or(z.literal("")),
    telephone: z.string().optional(),
    mobile: z.string().optional(),
  }),
});
export type VendorFormValues = z.infer<typeof vendorSchema>;

// From /item-registry/page.tsx
export const serviceSchema = z.object({
  id: z.string().optional(),
  type: z.literal("service"),
  serviceDescription: z.string().min(1, "Service description is required."),
  serviceStartDate: z.date({ required_error: "Start date is required." }),
  serviceEndDate: z.date({ required_error: "End date is required." }),
  supplierId: z.string().min(1, "Supplier is required."),
});
export const deviceSchema = z.object({
  id: z.string().optional(),
  type: z.literal("device"),
  deviceDescription: z.string().min(1, "Device/Item description is required."),
  model: z.string().optional(),
  make: z.string().optional(),
  countryOfMake: z.string().optional(),
  partNumber: z.string().optional(),
  serialNumber: z.string().optional(),
  macAddress: z.string().optional(),
  manufactureDate: z.date().optional(),
  expireDate: z.date().optional(),
  endOfSalesDate: z.date().optional(),
  endOfSupportDate: z.date().optional(),
  endOfLifeDate: z.date().optional(),
  warrantyStartDate: z.date().optional(),
  warrantyEndDate: z.date().optional(),
});
export const registrySchema = z.discriminatedUnion("type", [
  serviceSchema,
  deviceSchema,
]);
export type RegistryFormValues = z.infer<typeof registrySchema>;


// From /contracts/page.tsx
export const contractSchema = z.object({
  id: z.string().optional(),
  contractDescription: z.string().min(1, "Contract Description is required."),
  quantity: z.coerce.number().min(1, "Quantity is required."),
  supplierId: z.string().min(1, "Supplier is required."),
  mainDepartmentId: z.string().min(1, "Main Department is required."),
  subDepartmentId: z.string().min(1, "Sub Department is required."),
  contractPeriod: z.string().min(1, "Period of contract is required."),
  contractAmount: z.coerce.number().min(0, "Amount is required."),
  paymentTerms: z.string().min(1, "Payment Terms are required."),
  serviceStartDate: z.date({ required_error: "Service Start Date is required." }),
  serviceEndDate: z.date({ required_error: "Service End Date is required." }),
  nextRenewalDate: z.date().optional(),
  contractStatus: z.string().optional(),
  
  contractDocument: z.any().optional(),
  prCreateDate: z.date().optional(),
  prApproveDate: z.date().optional(),
  lpoIssueDate: z.date().optional(),
  lpoNumber: z.string().optional(),
  lpoAttachment: z.any().optional(),
  invoiceReceivedDate: z.date().optional(),
  invoiceAttachment: z.any().optional(),
  invoiceToFinanceDate: z.date().optional(),
  invoiceToFinanceAttachment: z.any().optional(),
  paymentSentDate: z.date().optional(),
  paymentReferenceAttachment: z.any().optional(),
  otherAttachment: z.any().optional(),
  remarks: z.string().optional(),
});
export type ContractFormValues = z.infer<typeof contractSchema>;


// From /opex-registry/page.tsx
export const opexItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Description is required."),
  period: z.string().min(1, "Period is required."),
  amount: z.coerce.number().min(0, "Amount is required."),
  implementation: z.string().min(1, "Implementation status is required."),
  serviceStatus: z.string().min(1, "Service status is required."),
  supplier: z.string().min(1, "Supplier is required."),
  remarks: z.string().optional(),
});
export type OpexItem = z.infer<typeof opexItemSchema>;


// From /capex-registry/page.tsx
export const capexItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Description is required."),
  priority: z.string().min(1, "Priority is required."),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
  amount: z.coerce.number().min(0, "Amount is required."),
  justification: z.string().min(1, "Justification is required."),
  remarks: z.string().optional(),
});
export type CapexItem = z.infer<typeof capexItemSchema>;


// From /approvals/inbox/page.tsx
export const approvalItemSchema = z.object({
    id: z.string(),
    type: z.enum(['CAPEX', 'OPEX']),
    organizationId: z.string(),
    departmentId: z.string(),
    year: z.string(),
    totalValue: z.number(),
    submittedBy: z.string(),
    submittedOn: z.date(),
    status: z.string()
});
export type ApprovalItem = z.infer<typeof approvalItemSchema>;


// From /settings/user-registration/page.tsx
export const permissionsSchema = z.record(z.enum(["read", "write", "full", "none", "hide"]));
const passwordSchema = z.string().min(8, "Password must be at least 8 characters.").optional().or(z.literal(''));

export const userRegistrationSchema = z
  .object({
    id: z.string().optional(),
    groupId: z.string().min(1, "Group is required."),
    organizationId: z.string().min(1, "Organization is required."),
    departmentId: z.string().min(1, "Department is required."),
    subDepartmentId: z.string().min(1, "Sub-department is required."),
    username: z.string().min(3, "Username must be at least 3 characters."),
    email: z.string().email("Invalid email address."),
    mobile: z.string().min(1, "Mobile number is required."),
    userRole: z.string().optional(),
    password: passwordSchema,
    confirmPassword: passwordSchema,
    permissions: permissionsSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })
  .refine((data) => {
    // If id exists, it's an existing user, password can be blank
    if(data.id) return true;
    // If it's a new user, password is required
    return !!data.password && data.password.length >= 8;
  }, {
    message: "Password is required for new users.",
    path: ["password"],
  });
export type User = z.infer<typeof userRegistrationSchema>;

// -- NEW SCHEMAS for Master Data --
export const groupSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Group name is required."),
});
export type GroupFormValues = z.infer<typeof groupSchema>;
export type Group = { id: string; name: string; };

export const organizationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Organization name is required."),
  groupId: z.string().min(1, "A parent group must be selected."),
});
export type OrganizationFormValues = z.infer<typeof organizationSchema>;
export type Organization = { id: string; name: string; groupId: string; };

export const departmentSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Department name is required."),
    organizationId: z.string().min(1, "A parent organization must be selected."),
});
export type DepartmentFormValues = z.infer<typeof departmentSchema>;
export type Department = { id: string; name: string; organizationId: string; };

export const subDepartmentSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, "Sub-department name is required."),
    departmentId: z.string().min(1, "A parent department must be selected."),
});
export type SubDepartmentFormValues = z.infer<typeof subDepartmentSchema>;
export type SubDepartment = { id: string; name: string; departmentId: string; };
