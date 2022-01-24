import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/core";
import { StatusBar } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useNetInfo } from "@react-native-community/netinfo";
import { synchronize } from "@nozbe/watermelondb/sync";
import { database } from "../../database";

import { Car } from "../../components/Car";
import { Car as ModelCar } from "../../database/models/Car";

import { LoadAnimation } from "../../components/LoadAnimation";

import { api } from "../../services/api";
import Logo from "../../assets/logo.svg";

import { Container, Header, TotalCars, HeaderContent, CarList } from "./styles";

export function Home() {
  const [cars, setCars] = useState<ModelCar[]>([]);
  const [loading, setLoading] = useState(true);

  const netInfo = useNetInfo();
  const navigation = useNavigation();

  function handleCarDetails(car: ModelCar) {
    navigation.navigate("CarDetails", { car });
  }

  async function offlineSynchronize() {
    await synchronize({
      database,
      pullChanges: async ({ lastPulledAt }) => {
        const response = await api.get(
          `cars/sync/pull?lastPulledVersion=${lastPulledAt || 0}`
        );

        const { changes, latestVersion } = response.data;
        return { changes, timestamp: latestVersion };
      },
      pushChanges: async ({ changes }) => {
        const user = changes.users;
        await api.post("/users/sync", user).catch(console.log);
      },
    });
  }

  useEffect(() => {
    let isMounted = true;

    async function fetchCars() {
      try {
        const carCollection = database.get<ModelCar>("cars");
        const cars = await carCollection.query().fetch();

        if (isMounted) {
          setCars(cars);
        }
      } catch (error) {
        console.log(error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchCars();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (netInfo.isConnected === true) {
      offlineSynchronize();
    }
  }, [netInfo.isConnected]);

  return (
    <Container>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <Header>
        <HeaderContent>
          <Logo width={RFValue(108)} height={RFValue(12)} />
          {!loading && <TotalCars>Total de {cars.length} carros</TotalCars>}
        </HeaderContent>
      </Header>
      {loading ? (
        <LoadAnimation />
      ) : (
        <CarList
          data={cars}
          keyExtractor={(car) => car.id}
          renderItem={({ item: car }) => (
            <Car data={car} onPress={() => handleCarDetails(car)} />
          )}
        />
      )}
    </Container>
  );
}
