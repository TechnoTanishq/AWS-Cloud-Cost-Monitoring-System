import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export default function AccountSettings() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleUpdateProfile = () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Name and email are required.");
      return;
    }
    updateProfile({ name: name.trim(), email: email.trim() });
    toast.success("Profile updated.");
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in both password fields.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    toast.success("Password changed successfully (mock).");
    setCurrentPassword("");
    setNewPassword("");
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your FinSight account? This action cannot be undone and all associated data will be removed.")) {
      logout();
      navigate("/");
      toast.success("Account deleted (mock).");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h2 className="text-xl font-bold mb-1">Account Settings</h2>
          <p className="text-sm text-muted-foreground">Manage your profile, security, and account preferences.</p>
        </div>

        {/* Profile */}
        <div className="card-elevated p-5 space-y-4">
          <h3 className="font-semibold text-sm">Profile Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Organization</Label>
            <Input value={user?.organization || ""} disabled className="bg-muted" />
          </div>
          <Button onClick={handleUpdateProfile}>Save Changes</Button>
        </div>

        {/* Password */}
        <div className="card-elevated p-5 space-y-4">
          <h3 className="font-semibold text-sm">Change Password</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="current">Current Password</Label>
              <Input id="current" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} maxLength={128} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new">New Password</Label>
              <Input id="new" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min. 8 characters" maxLength={128} />
            </div>
          </div>
          <Button variant="outline" onClick={handleChangePassword}>Update Password</Button>
        </div>

        {/* IAM */}
        <div className="card-elevated p-5 space-y-4">
          <h3 className="font-semibold text-sm">IAM Role Management</h3>
          <p className="text-sm text-muted-foreground">Update or disconnect your linked AWS IAM role.</p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/dashboard/iam")}>Update IAM Role</Button>
            <Button variant="outline" onClick={() => toast.success("AWS account disconnected (mock).")}>Disconnect AWS</Button>
          </div>
        </div>

        <Separator />

        {/* Danger zone */}
        <div className="card-elevated p-5 border-destructive/20">
          <h3 className="font-semibold text-sm text-destructive mb-2">Danger Zone</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Permanently delete your FinSight account and all associated data. This action cannot be undone.
          </p>
          <Button variant="destructive" onClick={handleDeleteAccount}>Delete Account</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
