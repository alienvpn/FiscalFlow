
"use server";

import { z } from "zod";
import { sendApprovalRequestNotification } from "@/services/notification-service";
import { approvalWorkflows, organizations, departments } from "@/lib/mock-data";

const capexItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Description is required."),
  priority: z.string().min(1, "Priority is required."),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
  amount: z.coerce.number().min(0, "Amount is required."),
  justification: z.string().min(1, "Justification is required."),
  remarks: z.string().optional(),
});

const capexRegistrySchema = z.object({
  organization: z.string().min(1, "Organization is required."),
  department: z.string().min(1, "Department is required."),
  year: z.string().min(1, "Year is required."),
  items: z.array(capexItemSchema),
});

type CapexFormValues = z.infer<typeof capexRegistrySchema>;

export async function submitCapexSheet(values: CapexFormValues) {
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
            sheetType: 'CAPEX',
            sheetDetails: {
                organization: orgName,
                department: deptName,
                year: values.year,
            }
        });

        return { success: true, message: `Your CAPEX sheet has been sent for approval to the ${firstApproverRole}.` };
    } catch (error) {
        console.error("Failed to submit CAPEX sheet:", error);
        return { success: false, error: "Failed to submit sheet for approval." };
    }
}

export async function saveCapexSheetAsDraft(values: CapexFormValues) {
    try {
        console.log("Saving as draft:", { ...values, status: 'Draft' });
        return { success: true, message: "Your CAPEX sheet has been saved as a draft." };
    } catch (error) {
        console.error("Failed to save CAPEX draft:", error);
        return { success: false, error: "Failed to save draft." };
    }
}
