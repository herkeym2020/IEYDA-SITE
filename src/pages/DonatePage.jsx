import { useState } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Heart, 
  Users,
  GraduationCap,
  Building,
  Lightbulb,
  CreditCard,
  Smartphone,
  Banknote,
  CheckCircle,
  Target,
  TrendingUp,
  Globe,
  Gift,
  Star
} from 'lucide-react'

const DonatePage = () => {
  const [selectedAmount, setSelectedAmount] = useState('')
  const [customAmount, setCustomAmount] = useState('')
  const [donationType, setDonationType] = useState('general')

  const donationOptions = [
    {
      id: 'general',
      title: 'General Support',
      description: 'Support all our programs and operations',
      icon: Heart,
      color: 'bg-primary',
      impact: 'Enables us to continue all our community development initiatives'
    },
    {
      id: 'education',
      title: 'Education & Scholarships',
      description: 'Fund scholarships for indigent students',
      icon: GraduationCap,
      color: 'bg-accent',
      impact: 'Provides educational opportunities for deserving students'
    },
    {
      id: 'empowerment',
      title: 'Youth Empowerment',
      description: 'Support skills training and capacity building',
      icon: Users,
      color: 'bg-secondary',
      impact: 'Equips young people with skills for economic independence'
    },
    {
      id: 'infrastructure',
      title: 'Infrastructure Development',
      description: 'Fund community infrastructure projects',
      icon: Building,
      color: 'bg-green-600',
      impact: 'Improves basic amenities in underserved communities'
    },
    {
      id: 'ict',
      title: 'ICT Training',
      description: 'Support digital skills programs',
      icon: Lightbulb,
      color: 'bg-purple-600',
      impact: 'Prepares youth for the digital economy'
    }
  ]

  const suggestedAmounts = ['5000', '10000', '25000', '50000', '100000', '250000']

  const impactLevels = [
    {
      amount: '₦5,000',
      impact: 'Provides training materials for 1 youth in ICT program',
      icon: Lightbulb
    },
    {
      amount: '₦25,000',
      impact: 'Sponsors 1 student\'s scholarship for a semester',
      icon: GraduationCap
    },
    {
      amount: '₦100,000',
      impact: 'Funds a complete skills training program for 10 youths',
      icon: Users
    },
    {
      amount: '₦500,000',
      impact: 'Supports a community infrastructure project',
      icon: Building
    }
  ]

  const paymentMethods = [
    {
      name: 'Bank Transfer',
      icon: Banknote,
      description: 'Direct bank transfer to IEYDA account',
      details: [
        'Account Name: Ilorin Emirate Youth Development Association',
        'Bank: First Bank of Nigeria',
        'Account Number: 2034567890',
        'Sort Code: 011151003'
      ]
    },
    {
      name: 'Mobile Money',
      icon: Smartphone,
      description: 'Pay via mobile money platforms',
      details: [
        'MTN Mobile Money: 08097090867',
        'Airtel Money: 08051679910',
        'Opay: 08097090867',
        'PalmPay: 08051679910'
      ]
    },
    {
      name: 'Online Payment',
      icon: CreditCard,
      description: 'Secure online payment with card',
      details: [
        'Visa, Mastercard accepted',
        'Secure SSL encryption',
        'Instant confirmation',
        'Receipt via email'
      ]
    }
  ]

  const achievements = [
    { number: '1,500+', label: 'Youth Empowered', icon: Users },
    { number: '500+', label: 'Scholarships Awarded', icon: GraduationCap },
    { number: '50+', label: 'Communities Served', icon: Globe },
    { number: '₦50M+', label: 'Impact Generated', icon: TrendingUp }
  ]

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="section-padding gradient-bg text-white relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-20"></div>
        <div className="container-max relative z-10">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-secondary/20 text-secondary border-secondary/30">
              <Heart className="h-4 w-4 mr-2" />
              Support Our Mission
            </Badge>
            <h1 className="heading-primary mb-6 text-shadow">
              Invest in Community Development
            </h1>
            <p className="text-large text-white/90 mb-8">
              Your donation helps us empower youth, build communities, and create lasting 
              positive change across the Ilorin Emirate. Every contribution makes a difference.
            </p>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  className="glass-effect rounded-xl p-6 text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <achievement.icon className="h-8 w-8 text-secondary mx-auto mb-3" />
                  <div className="text-2xl font-bold mb-1">{achievement.number}</div>
                  <div className="text-sm text-white/80">{achievement.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Donation Options */}
      <section className="section-padding">
        <div className="container-max">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-primary/10 text-primary">Choose Your Impact</Badge>
            <h2 className="heading-secondary mb-4">How Would You Like to Help?</h2>
            <p className="text-large text-muted-foreground max-w-3xl mx-auto">
              Select the area where you'd like to make the biggest impact. 
              Your support directly funds programs that transform lives.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {donationOptions.map((option, index) => (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card 
                  className={`feature-card cursor-pointer transition-all duration-300 ${
                    donationType === option.id 
                      ? 'ring-2 ring-primary shadow-lg' 
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => setDonationType(option.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${option.color} p-3 rounded-lg`}>
                        <option.icon className="h-6 w-6 text-white" />
                      </div>
                      {donationType === option.id && (
                        <CheckCircle className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{option.title}</h3>
                    <p className="text-muted-foreground mb-4 text-sm">
                      {option.description}
                    </p>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground">
                        <strong>Impact:</strong> {option.impact}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="section-padding bg-muted/30">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Donation Amount */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="p-8">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="flex items-center">
                    <Gift className="h-5 w-5 mr-2 text-primary" />
                    Choose Your Donation Amount
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-6">
                    {/* Suggested Amounts */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Suggested Amounts (₦)</Label>
                      <div className="grid grid-cols-3 gap-3">
                        {suggestedAmounts.map((amount) => (
                          <Button
                            key={amount}
                            variant={selectedAmount === amount ? "default" : "outline"}
                            onClick={() => {
                              setSelectedAmount(amount)
                              setCustomAmount('')
                            }}
                            className="h-12"
                          >
                            ₦{parseInt(amount).toLocaleString()}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Amount */}
                    <div>
                      <Label htmlFor="custom-amount">Or Enter Custom Amount (₦)</Label>
                      <Input
                        id="custom-amount"
                        type="number"
                        placeholder="Enter amount"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value)
                          setSelectedAmount('')
                        }}
                        className="text-lg h-12"
                      />
                    </div>

                    {/* Donor Information */}
                    <div className="space-y-4">
                      <h4 className="font-medium">Donor Information (Optional)</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="donor-name">Full Name</Label>
                          <Input id="donor-name" placeholder="Your name" />
                        </div>
                        <div>
                          <Label htmlFor="donor-email">Email Address</Label>
                          <Input id="donor-email" type="email" placeholder="your@email.com" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="donor-phone">Phone Number</Label>
                        <Input id="donor-phone" type="tel" placeholder="+234 xxx xxx xxxx" />
                      </div>
                      <div>
                        <Label htmlFor="donor-message">Message (Optional)</Label>
                        <Textarea 
                          id="donor-message" 
                          placeholder="Leave a message of support..."
                          rows={3}
                        />
                      </div>
                    </div>

                    <Button size="lg" className="w-full btn-primary">
                      <Heart className="h-5 w-5 mr-2" />
                      Proceed to Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Impact & Payment Methods */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Your Impact */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="flex items-center text-lg">
                    <Target className="h-5 w-5 mr-2 text-primary" />
                    Your Impact
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-4">
                    {impactLevels.map((level, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <level.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{level.amount}</div>
                          <div className="text-xs text-muted-foreground">{level.impact}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <Card className="p-6">
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="flex items-center text-lg">
                    <CreditCard className="h-5 w-5 mr-2 text-primary" />
                    Payment Methods
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-4">
                    {paymentMethods.map((method, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <method.icon className="h-5 w-5 text-primary" />
                          <h4 className="font-medium">{method.name}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                        <div className="space-y-1">
                          {method.details.map((detail, idx) => (
                            <p key={idx} className="text-xs text-muted-foreground">{detail}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Other Ways to Support */}
      <section className="section-padding">
        <div className="container-max">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-accent/10 text-accent">More Ways to Help</Badge>
            <h2 className="heading-secondary mb-4">Other Ways to Support IEYDA</h2>
            <p className="text-large text-muted-foreground max-w-3xl mx-auto">
              Beyond financial donations, there are many ways you can contribute 
              to our mission of community development.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="feature-card text-center">
                <CardContent className="p-8">
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-4">Volunteer</h3>
                  <p className="text-muted-foreground mb-6">
                    Share your skills and time to directly impact our programs and activities.
                  </p>
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="feature-card text-center">
                <CardContent className="p-8">
                  <div className="bg-secondary/10 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <Building className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-4">Corporate Partnership</h3>
                  <p className="text-muted-foreground mb-6">
                    Partner with us for CSR initiatives and community development projects.
                  </p>
                  <Button variant="outline" size="sm">
                    Partner With Us
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="feature-card text-center">
                <CardContent className="p-8">
                  <div className="bg-accent/10 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <Star className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold mb-4">Spread the Word</h3>
                  <p className="text-muted-foreground mb-6">
                    Help us reach more people by sharing our mission on social media.
                  </p>
                  <Button variant="outline" size="sm">
                    Share Now
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Thank You Section */}
      <section className="section-padding gradient-bg text-white relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-20"></div>
        <div className="container-max relative z-10">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-secondary mb-6 text-shadow">
              Thank You for Your Support
            </h2>
            <p className="text-large text-white/90 mb-8">
              Every donation, no matter the size, brings us closer to our vision of 
              empowered youth and thriving communities across the Ilorin Emirate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Heart className="h-5 w-5 mr-2" />
                Donate Now
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 hover:text-white"
              >
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default DonatePage

