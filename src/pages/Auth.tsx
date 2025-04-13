
import React, { useEffect } from 'react';
import { SignIn, SignUp, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthHeader from '@/components/auth/AuthHeader';

const Auth = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  
  useEffect(() => {
    // Redirect to dashboard if already signed in
    if (isSignedIn) {
      navigate('/', { replace: true });
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8 bg-gradient-to-b from-background to-muted/30">
      <div className="w-full max-w-md">
        <AuthHeader />
        
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <SignIn 
                fallbackRedirectUrl="/"
                redirectUrl="/"
                signUpUrl="/auth?tab=signup"
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none p-0 border-0",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    socialButtonsBlockButton: "bg-white border border-input hover:bg-accent hover:text-accent-foreground",
                    formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-md",
                    formFieldInput: "bg-background border border-input rounded-md",
                    footerActionText: "text-muted-foreground",
                    footerActionLink: "text-primary hover:text-primary/90"
                  }
                }}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="signup">
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <SignUp 
                fallbackRedirectUrl="/"
                redirectUrl="/"
                signInUrl="/auth?tab=login"
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none p-0 border-0",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    socialButtonsBlockButton: "bg-white border border-input hover:bg-accent hover:text-accent-foreground",
                    formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90 rounded-md",
                    formFieldInput: "bg-background border border-input rounded-md",
                    footerActionText: "text-muted-foreground",
                    footerActionLink: "text-primary hover:text-primary/90"
                  }
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
