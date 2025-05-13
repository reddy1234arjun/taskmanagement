import Link from "next/link";
import { ArrowRight, CheckCircle, Clock, List, BarChart2, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <List className="h-6 w-6 text-primary" />
            <span className="font-semibold text-xl">TaskMaster</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="#features" className="text-foreground hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#" className="text-foreground hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link href="#" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="px-4 py-2 text-foreground hover:text-primary transition-colors"
            >
              Login
            </Link>
            <Link 
              href="/register" 
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary hover:bg-opacity-90 transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold tracking-tight text-foreground">
              Streamline Your Workflow with TaskMaster
            </h1>
            <p className="text-xl text-muted-foreground max-w-md">
              The comprehensive task management system designed to boost productivity and organize your work efficiently.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/register" 
                className="flex items-center gap-2 px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary hover:bg-opacity-90 transition-colors"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link 
                href="/dashboard/demo" 
                className="flex items-center gap-2 px-6 py-3 rounded-md border border-border text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                View Demo
              </Link>
            </div>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl border border-border">
            <img 
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop" 
              alt="Dashboard Preview" 
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-background bg-opacity-10"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-accent bg-opacity-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Task Management Features</h2>
            <p className="text-muted-foreground">
              Everything you need to organize, track, and complete your tasks efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Task Organization</h3>
              <p className="text-muted-foreground">
                Create, categorize, and manage tasks with custom statuses and priorities to keep your workflow organized.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Due Date Tracking</h3>
              <p className="text-muted-foreground">
                Set deadlines and receive reminders to ensure you never miss an important task deadline again.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mb-4">
                <BarChart2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Progress Dashboard</h3>
              <p className="text-muted-foreground">
                Visualize your productivity with intuitive charts and statistics that track your task completion rate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Dashboard Interface</h2>
            <p className="text-muted-foreground">
              Get a comprehensive view of your tasks and progress with our intuitive dashboard
            </p>
          </div>
          
          <div className="border border-border rounded-lg overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop" 
              alt="Dashboard Interface" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-6">
            Ready to boost your productivity?
          </h2>
          <p className="text-primary-foreground text-opacity-80 max-w-xl mx-auto mb-8">
            Join thousands of professionals who have transformed their workflow with TaskMaster
          </p>
          <Link 
            href="/register" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-background text-foreground hover:bg-background hover:bg-opacity-90 transition-colors"
          >
            Get Started for Free <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3 flex justify-center">
              <Shield className="h-24 w-24 text-primary" />
            </div>
            <div className="md:w-2/3">
              <h2 className="text-2xl font-bold mb-4">Secure and Reliable</h2>
              <p className="text-muted-foreground mb-4">
                TaskMaster uses industry-standard security practices including JWT authentication to ensure your data remains private and secure.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>JWT-based authentication system</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Data encryption at rest and in transit</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Regular security updates and monitoring</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-background border-t border-border mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <List className="h-5 w-5 text-primary" />
              <span className="font-semibold">TaskMaster</span>
            </div>
            <div className="flex flex-wrap gap-6">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
            <div className="mt-4 md:mt-0 text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} TaskMaster Inc. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
