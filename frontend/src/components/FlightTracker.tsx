import React, { useState, useEffect } from 'react';
import { PlaneTakeoff, PlaneLanding, Search, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Flight {
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  status: string;
}

const FlightTracker: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8080/api/flights');
      if (!response.ok) throw new Error('Failed to fetch flights');
      const data = await response.json();
      setFlights(data);
    } catch (err) {
      setError('Could not connect to the flight server.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredFlights = flights.filter(flight => 
    flight.flightNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flight.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flight.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
    flight.airline.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'on time': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'delayed': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'in air': return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20';
      case 'boarding': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-slate-300 bg-slate-800 border-slate-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status.toLowerCase()) {
      case 'on time': return <CheckCircle2 className="w-4 h-4 mr-2" />;
      case 'delayed': return <AlertCircle className="w-4 h-4 mr-2" />;
      case 'in air': return <PlaneTakeoff className="w-4 h-4 mr-2" />;
      case 'boarding': return <Clock className="w-4 h-4 mr-2" />;
      default: return null;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="flex flex-col items-center mb-16 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-cyan-500/10 rounded-2xl mb-6 border border-cyan-500/20">
          <PlaneTakeoff className="w-8 h-8 text-cyan-400" />
        </div>
        <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-400">
          Avtra Flight Tracker
        </h1>
        <p className="text-slate-400 text-lg max-w-xl">
          Real-time flight status, departure, and arrival information.
        </p>
      </div>

      <div className="relative mb-12 max-w-2xl mx-auto">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-cyan-400" />
        </div>
        <input
          type="text"
          className="w-full glassmorphism pl-12 pr-4 py-4 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-lg shadow-lg"
          placeholder="Search by flight number, airline, or city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
        </div>
      ) : error ? (
        <div className="glassmorphism p-6 rounded-2xl text-center border-red-500/30 text-red-400 flex flex-col items-center">
          <AlertCircle className="w-10 h-10 mb-3 text-red-500" />
          <p>{error}</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredFlights.length > 0 ? (
            filteredFlights.map((flight) => (
              <div 
                key={flight.flightNumber} 
                className="glassmorphism rounded-3xl p-6 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-900/20 group cursor-default"
              >
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  
                  {/* Flight Info */}
                  <div className="flex-1 w-full flex items-center justify-between md:justify-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-slate-700/50 shadow-inner group-hover:border-cyan-500/30 transition-colors">
                      <span className="font-bold text-xl text-cyan-400">{flight.airline.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight">{flight.flightNumber}</h3>
                      <p className="text-slate-400 text-sm font-medium">{flight.airline}</p>
                    </div>
                  </div>

                  {/* Route & Times */}
                  <div className="flex-[2] w-full flex items-center justify-between px-4">
                    <div className="text-right flex-1">
                      <p className="text-2xl font-bold text-white mb-1">{formatTime(flight.departureTime).split(',')[0]}</p>
                      <p className="text-slate-400 text-sm">{flight.origin}</p>
                    </div>
                    
                    <div className="flex-1 px-6 flex flex-col items-center relative">
                      <div className="w-full h-[2px] bg-slate-700 relative flex items-center justify-center">
                        <div className="absolute w-2 h-2 rounded-full bg-slate-500 left-0"></div>
                        <PlaneTakeoff className="text-cyan-400 w-6 h-6 absolute bg-[#0f172a] px-1 z-10" />
                        <div className="absolute w-2 h-2 rounded-full bg-slate-500 right-0"></div>
                      </div>
                      <p className="text-xs text-slate-500 mt-3 font-medium">DIRECT</p>
                    </div>

                    <div className="text-left flex-1">
                      <p className="text-2xl font-bold text-white mb-1">{formatTime(flight.arrivalTime).split(',')[0]}</p>
                      <p className="text-slate-400 text-sm">{flight.destination}</p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex-1 w-full md:w-auto flex justify-end">
                    <div className={`px-4 py-2 rounded-full border flex items-center text-sm font-semibold tracking-wide ${getStatusColor(flight.status)}`}>
                      {getStatusIcon(flight.status)}
                      {flight.status}
                    </div>
                  </div>

                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 text-slate-400 glassmorphism rounded-3xl">
              <p className="text-xl">No flights found matching your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlightTracker;
