
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from '@/components/auth/LoginForm';
import SignUpForm from '@/components/auth/SignUpForm';
import SessionCheck from '@/components/auth/SessionCheck';
import AuthHeader from '@/components/auth/AuthHeader';

const Auth = () => {
  return (
    <SessionCheck>
      <div className="flex items-center justify-center min-h-screen px-4 py-8 bg-gradient-to-b from-background to-muted/30">
        <div className="w-full max-w-md">
          <AuthHeader />
          
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            
            <TabsContent value="signup">
              <SignUpForm />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </SessionCheck>
  );
};

export default Auth;
