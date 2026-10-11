/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { LoadingIndicator } from './src/components/common/LoadingIndicator';
import { LoginScreen } from './src/screens/auth/LoginScreen';
import { SignUpScreen } from './src/screens/auth/SignUpScreen';
import { SalonDetailsScreen } from './src/screens/details/SalonDetailsScreen';
import { SalonDiscoveryScreen } from './src/screens/discovery/SalonDiscoveryScreen';
import { BookingScreen } from './src/screens/booking/BookingScreen';
import { ConfirmationScreen } from './src/screens/confirmation/ConfirmationScreen';
import { BookingHistoryScreen } from './src/screens/history/BookingHistoryScreen';
import { ProfileScreen } from './src/screens/profile/ProfileScreen';
import { authApi } from './src/services/api/authApi';
import { setAuthToken } from './src/services/api/apiClient';
import {
  clearSessionToken,
  readSessionToken,
  saveSessionToken,
} from './src/services/auth/sessionStorage';
import type { Booking } from './src/types/booking.types';
import type { AuthSession, Customer } from './src/types/customer.types';
import type { Salon } from './src/types/salon.types';
import type { Service } from './src/types/service.types';

function App() {
  const [selectedSalon, setSelectedSalon] = useState<Salon | null>(null);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isViewingBookings, setIsViewingBookings] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isRestoringSession, setIsRestoringSession] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);
  const [pendingDestination, setPendingDestination] = useState<
    'booking' | 'bookings' | 'profile' | null
  >(null);
  const [isViewingProfile, setIsViewingProfile] = useState(false);
  const [returnToProfile, setReturnToProfile] = useState(false);

  useEffect(() => {
    let active = true;
    const restore = async () => {
      try {
        const token = await readSessionToken();
        if (!token) {
          return;
        }
        setAuthToken(token);
        try {
          const restoredCustomer = await authApi.me();
          if (active) {
            setCustomer(restoredCustomer);
          }
        } catch (error) {
          setAuthToken(null);
          if (
            axios.isAxiosError(error) &&
            [401, 403].includes(error.response?.status ?? 0)
          ) {
            await clearSessionToken().catch(() => undefined);
          }
        }
      } catch {
        setAuthToken(null);
      } finally {
        if (active) {
          setIsRestoringSession(false);
        }
      }
    };
    restore().catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  const handleBookServices = (salon: Salon, services: Service[]) => {
    setSelectedSalon(salon);
    setSelectedServices(services);
    if (!customer) {
      setPendingDestination('booking');
      setAuthMode('login');
    }
  };

  const beginAuthentication = (
    destination: 'booking' | 'bookings' | 'profile',
  ) => {
    setPendingDestination(destination);
    setAuthMode('login');
  };

  const handleAuthenticated = async (session: AuthSession) => {
    setAuthToken(session.token);
    try {
      await saveSessionToken(session.token);
    } catch (error) {
      setAuthToken(null);
      throw error;
    }
    setCustomer(session.customer);
    setAuthMode(null);
    setIsViewingProfile(pendingDestination === 'profile');
    setIsViewingBookings(pendingDestination === 'bookings');
    setReturnToProfile(false);
    setPendingDestination(null);
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Always remove device credentials if the network is unavailable.
    }
    await clearSessionToken().catch(() => undefined);
    setAuthToken(null);
    setCustomer(null);
    setIsViewingProfile(false);
    setIsViewingBookings(false);
    setSelectedSalon(null);
    setSelectedServices([]);
    setBooking(null);
  };

  const resetFlow = () => {
    setIsViewingBookings(false);
    setSelectedSalon(null);
    setSelectedServices([]);
    setBooking(null);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />

        {isRestoringSession ? (
          <LoadingIndicator label="Restoring your session…" />
        ) : authMode ? (
          authMode === 'signup' ? (
            <SignUpScreen
              onAuthenticated={handleAuthenticated}
              onLogin={() => setAuthMode('login')}
              onCancel={() => setAuthMode('login')}
            />
          ) : (
            <LoginScreen
              onAuthenticated={handleAuthenticated}
              onSignUp={() => setAuthMode('signup')}
              onCancel={() => {
                setAuthMode(null);
                setPendingDestination(null);
                if (pendingDestination === 'booking') {
                  setSelectedServices([]);
                }
              }}
            />
          )
        ) : isViewingBookings && customer ? (
          <BookingHistoryScreen
            onBack={() => {
              setIsViewingBookings(false);
              if (returnToProfile) {
                setIsViewingProfile(true);
              }
            }}
          />
        ) : isViewingProfile && customer ? (
          <ProfileScreen
            customer={customer}
            onCustomerUpdated={setCustomer}
            onBack={() => setIsViewingProfile(false)}
            onBookings={() => {
              setReturnToProfile(true);
              setIsViewingProfile(false);
              setIsViewingBookings(true);
            }}
            onLogout={handleLogout}
          />
        ) : selectedSalon && selectedServices.length && booking ? (
          <ConfirmationScreen
            salon={selectedSalon}
            services={selectedServices}
            date={booking.date}
            time={booking.time}
            onExplore={resetFlow}
          />
        ) : selectedSalon && selectedServices.length && customer ? (
          <BookingScreen
            salon={selectedSalon}
            services={selectedServices}
            onBack={() => setSelectedServices([])}
            onComplete={setBooking}
          />
        ) : selectedSalon ? (
          <SalonDetailsScreen
            salon={selectedSalon}
            onBack={resetFlow}
            onBookServices={handleBookServices}
          />
        ) : (
          <SalonDiscoveryScreen
            onSelectSalon={setSelectedSalon}
            onViewBookings={() => {
              if (customer) {
                setReturnToProfile(false);
                setIsViewingBookings(true);
              } else {
                beginAuthentication('bookings');
              }
            }}
            onProfile={() => {
              if (customer) {
                setIsViewingProfile(true);
              } else {
                beginAuthentication('profile');
              }
            }}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;
