
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const PasswordManager = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);

  const handlePasswordChange = async () => {
    setIsPasswordChanging(true);
    
    try {
      if (newPassword !== confirmPassword) {
        toast.error("New passwords don't match");
        return;
      }
      
      // In a real implementation, you would call an API to update the password
      // For now, we'll just show a success message
      setTimeout(() => {
        toast.success("Password updated successfully");
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setIsPasswordChanging(false);
      }, 1000);
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Failed to update password");
      setIsPasswordChanging(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="current-password">Current Password</Label>
        <Input 
          type="password" 
          id="current-password" 
          placeholder="••••••••" 
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="new-password">New Password</Label>
        <Input 
          type="password" 
          id="new-password" 
          placeholder="••••••••" 
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm New Password</Label>
        <Input 
          type="password" 
          id="confirm-password" 
          placeholder="••••••••" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <Button 
        className="bg-app-orange hover:bg-app-orange/90 mt-2"
        onClick={handlePasswordChange}
        disabled={isPasswordChanging || !currentPassword || !newPassword || !confirmPassword}
      >
        {isPasswordChanging ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Updating Password...
          </>
        ) : (
          'Update Password'
        )}
      </Button>
    </div>
  );
};

export default PasswordManager;
