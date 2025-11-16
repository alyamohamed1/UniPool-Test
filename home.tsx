import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin } from 'lucide-react-native';
import { useAuth, useRides } from '../../context/AppContext';
import RideCard from '../../components/RideCard';
import Colors from '../../constants/colors';



export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { availableRides } = useRides();
  const [MapView, setMapView] = useState<any>(null);
  const [Marker, setMarker] = useState<any>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      import('react-native-maps').then((maps) => {
        setMapView(() => maps.default);
        setMarker(() => maps.Marker);
      });
    }
  }, []);

  const mockRides = [
    {
      id: '1',
      driverId: '2',
      driverName: 'Sarah Ahmed',
      driverRating: 4.9,
      carDetails: {
        model: 'Toyota Camry',
        plateNumber: '123456',
        color: 'Silver',
        year: 2022,
        seats: 4,
      },
      departure: {
        latitude: 26.0667,
        longitude: 50.5577,
        address: 'American University of Bahrain',
      },
      destination: {
        latitude: 26.2361,
        longitude: 50.5831,
        address: 'Manama City Center',
      },
      departureTime: new Date(Date.now() + 3600000).toISOString(),
      availableSeats: 3,
      pricePerSeat: 2,
      status: 'pending' as const,
      passengers: [],
    },
    {
      id: '2',
      driverId: '3',
      driverName: 'Mohammed Ali',
      driverRating: 4.7,
      carDetails: {
        model: 'Honda Civic',
        plateNumber: '789012',
        color: 'Blue',
        year: 2021,
        seats: 4,
      },
      departure: {
        latitude: 26.0667,
        longitude: 50.5577,
        address: 'University of Bahrain',
      },
      destination: {
        latitude: 26.2235,
        longitude: 50.5876,
        address: 'Seef Mall',
      },
      departureTime: new Date(Date.now() + 5400000).toISOString(),
      availableSeats: 2,
      pricePerSeat: 2.5,
      status: 'pending' as const,
      passengers: [],
    },
  ];

  const displayRides = availableRides.length > 0 ? availableRides : mockRides;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 16, 24) }]}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/mvfrv2p799open92lqb3q' }}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.greeting}>Hello, {user?.name || 'Rider'}!</Text>
        <Text style={styles.subtitle}>Where are you going today?</Text>

        <View style={styles.mapContainer}>
          {Platform.OS === 'web' || !MapView || !Marker ? (
            <View style={styles.mapPlaceholder}>
              <MapPin size={48} color={Colors.blue} />
              <Text style={styles.mapPlaceholderText}>Map View</Text>
            </View>
          ) : (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: 26.0667,
                longitude: 50.5577,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{
                  latitude: 26.0667,
                  longitude: 50.5577,
                }}
                title="Your Location"
              />
            </MapView>
          )}
          <View style={styles.mapOverlay}>
            <Text style={styles.mapLabel}>Pickup Location</Text>
          </View>
        </View>

        <View style={styles.destinationInput}>
          <MapPin size={20} color={Colors.purple} />
          <Text style={styles.destinationText}>Where to?</Text>
        </View>

        <View style={styles.ridesSection}>
          <Text style={styles.sectionTitle}>Available Rides</Text>
          {displayRides.map(ride => (
            <RideCard
              key={ride.id}
              ride={ride}
              onPress={() => console.log('View ride', ride.id)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightLavender,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoImage: {
    width: 180,
    height: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.darkGray,
    marginTop: 24,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray,
    marginTop: 4,
    marginBottom: 24,
  },
  mapContainer: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    marginTop: 8,
    fontSize: 14,
    color: Colors.gray,
  },
  mapOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: Colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.darkGray,
  },
  destinationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.purple,
    gap: 12,
    marginBottom: 24,
  },
  destinationText: {
    fontSize: 16,
    color: Colors.gray,
    fontWeight: '600',
    flex: 1,
  },
  ridesSection: {
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.darkGray,
    marginBottom: 16,
  },
});
