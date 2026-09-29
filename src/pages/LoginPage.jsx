import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff,
  ArrowRight,
  Shield,
  CheckCircle
} from 'lucide-react'

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false)
      // For demo purposes, redirect to homepage
      navigate('/')
    }, 2000)
  }

  const benefits = [
    "Access to exclusive member programs",
    "Priority registration for events",
    "Networking opportunities",
    "Skills development resources",
    "Community impact updates"
  ]

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-primary/5 via-white to-secondary/5">
      <div className="container-max py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <Badge className="mb-4 bg-primary/10 text-primary">Member Login</Badge>
                <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
                <p className="text-muted-foreground">
                  Sign in to access your IEYDA member dashboard
                </p>
              </div>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-primary" />
                    Member Login
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span>Remember me</span>
                      </label>
                      <Link to="/forgot-password" className="text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      size="lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Signing In...
                        </div>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                      Don't have an account?{' '}
                      <Link to="/signup" className="text-primary hover:underline font-medium">
                        Sign up here
                      </Link>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Right Side - Benefits */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:pl-8"
          >
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-2xl font-bold mb-4">Member Benefits</h2>
              <p className="text-muted-foreground">
                Join thousands of youth across the Ilorin Emirate who are building 
                their future through IEYDA membership.
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <div className="bg-green-100 p-1 rounded-full">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm">{benefit}</span>
                </motion.div>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <User className="h-8 w-8 text-primary mr-3" />
                  <div>
                    <h3 className="font-semibold">New to IEYDA?</h3>
                    <p className="text-sm text-muted-foreground">
                      Create your account and start your journey
                    </p>
                  </div>
                </div>
                <Link to="/signup">
                  <Button variant="outline" className="w-full">
                    Create Account
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

