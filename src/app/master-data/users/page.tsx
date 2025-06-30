import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function UsersPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            This page has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please use the new "Create User" link in the Master menu.</p>
        </CardContent>
      </Card>
    </div>
  );
}
