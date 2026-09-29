import { getImageUrl } from '@/lib/utils'
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Shield, Users, ArrowRight } from 'lucide-react';
import { apiFetch } from '@/lib/api';

const roleIconMap = {
  grand_patron: Crown,
  president: Shield,
  executive: Users,
};

function getRoleIcon(type, position) {
  if (type === 'grand_patron') return Crown;
  if (position && position.toLowerCase().includes('president')) return Shield;
  return Users;
}


export default function LeadershipSectionDynamic({ leaders = [] }) {


  // Filter for homepage: Grand Patron and President only
  const grandPatron = leaders.find(l => l.type === 'grand_patron');
  const president = leaders.find(l => l.position && l.position.toLowerCase().includes('president'));

  return (
    <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
      <div className="container-max">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Badge className="mb-4 bg-yellow-100 text-yellow-800">
            <Crown className="h-4 w-4 mr-2" />
            Leadership
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Visionary Leadership</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Under the distinguished patronage and dedicated leadership, IEYDA continues 
            to drive meaningful change across the Ilorin Emirate.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Grand Patron */}
          {grandPatron && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="overflow-hidden shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 h-full rounded-xl">
                <div className="p-0">
                  <div className="relative h-80">
                    <img 
                      src={getImageUrl(grandPatron.image)} 
                      alt={grandPatron.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-yellow-500 text-black border-0 shadow-lg">
                        <Crown className="h-3 w-3 mr-1" />
                        Grand Patron
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold mb-1">{grandPatron.name}</h3>
                      <p className="text-lg font-semibold">{grandPatron.position}</p>
                      {grandPatron.location && <p className="text-sm opacity-90">{grandPatron.location}</p>}
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {grandPatron.bio}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {/* President */}
          {president && (
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="overflow-hidden shadow-xl border-0 bg-gradient-to-br from-white to-gray-50 h-full rounded-xl">
                <div className="p-0">
                  <div className="relative h-80">
                    <img 
                      src={getImageUrl(president.image)} 
                      alt={president.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-primary text-white border-0 shadow-lg">
                        <Shield className="h-3 w-3 mr-1" />
                        National President
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold mb-1">{president.name}</h3>
                      <p className="text-lg font-semibold">{president.position}</p>
                      {president.term && <p className="text-sm opacity-90">{president.term}</p>}
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {president.bio}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
        <div className="text-center mt-8">
          <Link to="/team">
            <Button size="lg" className="px-8 py-3 hover:scale-105 transition-transform duration-200">
              <Users className="h-5 w-5 mr-2" />
              Meet Our Full Team
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
