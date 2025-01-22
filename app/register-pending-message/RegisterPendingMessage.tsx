"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function RegisterPendingMessage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 space-y-6 text-center">
        <div className="flex justify-center">
          <CheckCircle2 className="h-16 w-16 text-primary" />
        </div>

        <h1 className="text-2xl font-semibold text-foreground">
          Registration Successfully Submitted
        </h1>

        <div className="space-y-4 text-muted-foreground">
          <p>
            Thank you for registering with the Catch Monitoring System. Your
            application has been received and is currently under review by our
            administrative team.
          </p>

          <p>
            During this time, our team will verify your credentials and assess
            your role application. This process typically takes 1-2 business
            days, though it may require additional time depending on the role
            requested and current application volume.
          </p>

          <p>
            You will receive an email notification at the address you provided
            once your registration has been approved. This email will contain
            your login credentials and additional instructions for accessing the
            system.
          </p>

          <div className="bg-secondary/50 p-4 rounded-lg mt-6">
            <p className="font-medium text-foreground">
              If you have any questions or concerns about your application,
              please contact our support team at:
            </p>
            <p className="text-primary">support@catchmonitoring.com</p>
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Button variant="outline" asChild>
            <Link href="/">Return to Home</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Go to Login</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
