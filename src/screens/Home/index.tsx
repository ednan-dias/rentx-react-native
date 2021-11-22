import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/core";
import { StatusBar } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import api from "../../services/api";

import Logo from "../../assets/logo.svg";
import { Car } from "../../components/Car";
import { Load } from "../../components/Load";

import { Container, Header, TotalCars, HeaderContent, CarList } from "./styles";
import { CarDTO } from "../../dtos/CarDTO";

type NavigationProps = {
  navigate: (
    screen: string,
    object: {
      car: CarDTO;
    }
  ) => void;
};

export function Home() {
  const [cars, setCars] = useState<CarDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<NavigationProps>();

  function handleCarDetails(car: CarDTO) {
    navigation.navigate("CarDetails", { car });
  }

  useEffect(() => {
    async function fetchCars() {
      try {
        const response = await api.get("/cars");
        setCars(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, []);

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
          <TotalCars>Total de 12 carros</TotalCars>
        </HeaderContent>
      </Header>
      {loading ? (
        <Load />
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
