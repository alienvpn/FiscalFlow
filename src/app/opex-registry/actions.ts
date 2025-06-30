
"use server";

import { z } from "zod";
import { sendApprovalRequestNotification } from "@/services/notification-service";
import { approvalWorkflows, organizations, departments } from "@/lib/mock-data";

const opexItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Description is required."),
  period: z.string().min(1, "Period is required."),
  amount: z.coerce.number().min(0, "Amount is required."),
  implementation: z.string().min(1, "Implementation status is required."),
  serviceStatus: z.string().min(1, "Service status is required."),
  supplier: z.string().min(1, "Supplier is required."),
  remarks: z.string().optional(),
});

const opexRegistrySchema = z.object({
  organization: z.string().min(1, "Organization is required."),
  department: z.string().min(1, "Department is required."),
  year: z.string().min(1, "Year is required."),
  items: z.array(opexItemSchema),
});

type OpexFormValues = z.infer<typeof opexRegistrySchema>;

export async function submitOpexSheet(values: OpexFormValues) {
    try {
        console.log("Submitting for approval:", { ...values, status: 'Pending Approval' });
        
        const firstApproverRole = approvalWorkflows.budget[0]?.approverRole;
        if (!firstApproverRole) {
            throw new Error("No approver role found in the approval matrix.");
        }

        const orgName = organizations.find(o => o.id === values.organization)?.name || "N/A";
        const deptName = departments.find(d => d.id === values.department)?.name || "N/A";

        await sendApprovalRequestNotification({
            approverRole: firstApproverRole,
            sheetType: 'OPEX',
            sheetDetails: {
                organization: orgName,
                department: deptName,
                year: values.year,
            }
        });
        
        return { success: true, message: `Your OPEX sheet has been sent for approval to the ${firstApproverRole}.` };
    } catch (error) {
        console.error("Failed to submit OPEX sheet:", error);
        return { success: false, error: "Failed to submit sheet for approval." };
    }
}

export async function saveOpexSheetAsDraft(values: OpexFormValues) {
    try {
        console.log("Saving as draft:", { ...values, status: 'Draft' });
        return { success: true, message: "Your OPEX sheet has been saved as a draft." };
    } catch (error) {
        console.error("Failed to save OPEX draft:", error);
        return { success: false, error: "Failed to save draft." };
    }
}
