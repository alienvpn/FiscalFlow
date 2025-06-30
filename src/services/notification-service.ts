
'use server';

/**
 * @fileOverview A service for handling notifications.
 * This is a placeholder service that logs notifications to the console.
 * It can be replaced with a real email service provider integration.
 */

interface SheetDetails {
  organization: string;
  department: string;
  year: string;
  totalValue?: number;
}

interface SendApprovalRequestNotificationParams {
  approverRole: string;
  sheetType: 'CAPEX' | 'OPEX';
  sheetDetails: SheetDetails;
}

export async function sendApprovalRequestNotification({
  approverRole,
  sheetType,
  sheetDetails,
}: SendApprovalRequestNotificationParams): Promise<void> {
  const fromAddress = process.env.SENDER_EMAIL_ADDRESS || 'noreply@fiscalflow.com';
  const subject = `Approval Request: ${sheetType} Sheet for ${sheetDetails.year}`;
  const body = `
    A new ${sheetType} sheet has been submitted for your approval.
    
    Details:
    - Organization: ${sheetDetails.organization}
    - Department: ${sheetDetails.department}
    - Year: ${sheetDetails.year}
    
    Please log in to FiscalFlow to review and take action.
  `;

  console.log('--- SIMULATING EMAIL NOTIFICATION ---');
  console.log(`FROM: ${fromAddress}`);
  console.log(`TO_ROLE: ${approverRole}`);
  console.log(`SUBJECT: ${subject}`);
  console.log(`BODY: ${body.trim()}`);
  console.log('------------------------------------');
}
