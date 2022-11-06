import { HStack, useToast, VStack } from "native-base";
import { Header } from "../components/Header";
import { useRoute } from "@react-navigation/native";
import { Share } from 'react-native'; 
import { useState, useEffect } from 'react';

import { api } from "../services/api";

import { Loading } from "../components/Loading";
import { PoolCardProps } from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Option } from "../components/Option";
import { Guesses } from "../components/Guesses";

interface RouteParams {
    id: string
}

export function Details() {

    const route = useRoute();
    const { id } = route.params as RouteParams;

    const [isLoading, setIsLoading] = useState(false);

    const [optionSelected, setOptionSelected] = useState<'guesses' | 'ranking'>('guesses');

    const [poolDetails, setPoolDetails] = useState<PoolCardProps>({} as PoolCardProps);
    
    const toast = useToast();

    async function fetchPoolDetails() {
        try {
            setIsLoading(true);

            const response = await api.get(`/pools/${id}`);
            setPoolDetails(response.data.pool);
        } catch (err) {
            console.log(err);
            toast.show({
                title: 'Não foi possível carregar os detalhes do bolão',
                placement: 'top',
                bgColor: 'red.500'
            })
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchPoolDetails();
    }, [id]);

    async function handleCodeShare() {
        await Share.share({
            message: poolDetails.code
        })
    }

    if (isLoading) {
        return (
            <Loading />
        );
    }

    return (
        <VStack flex={1} bgColor='gray.900'>
            <Header title={poolDetails.title}
                showBackButton showShareButton
                 shareFunction={handleCodeShare} />
                {
                    poolDetails._count?.participants > 0 ?
                    <VStack mx={5} mt={2}>
                        <PoolHeader data={poolDetails} />
                        <HStack bgColor="gray.800" p={1} rounded="sm" mb={5} >
                            <Option title="Seus palpites" 
                            isSelected={optionSelected === 'guesses'}
                            onPress={() => setOptionSelected("guesses")}/>

                            <Option title="Ranking do grupo" 
                            isSelected={optionSelected === 'ranking'}
                            onPress={() => setOptionSelected('ranking')}/>
                            </HStack>
                        
                        <Guesses poolId={poolDetails.id} code={poolDetails.code} />
                    </VStack>

                    : <EmptyMyPoolList code={poolDetails.code} />
                }
        </VStack >
    );
}