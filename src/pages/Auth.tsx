
import React from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthHeader from '@/components/auth/AuthHeader';
import { useSearchParams } from 'react-router-dom';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') === 'signup' ? 'signup' : 'login';
  
  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-8 bg-gradient-to-b from-background to-muted/30">
      <div className="w-full max-w-md">
        <AuthHeader />
        
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <div className="bg-card rounded-lg border shadow-sm p-6">
              <SignIn 
                redirectUrl="/"
                afterSignInUrl="/"
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
                redirectUrl="/"
                afterSignUpUrl="/"
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
