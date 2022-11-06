import { Heading, VStack, useToast } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { useState } from 'react';

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

import { api } from "../services/api";
import { ReciviedMessages } from "../@enum/reciviedMessages";

export function Find() {

    const { navigate } = useNavigation();

    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [code, setCode] = useState('');

    async function handleJoinPool() {
       
        if (!code.trim()) {
            return toast.show({
                title: 'Informe o código do bolão',
                placement: 'top',
                bgColor: 'red.500'
            });
        }

        try {
            setIsLoading(true);
            await api.post('/pools/join', { code });
            setCode('');
            toast.show({
                title: 'Você entrou no bolão com sucesso',
                placement: 'top',
                bgColor: 'green.500'
            });
            navigate('pools');
        } catch (err) {
            console.log(err);
            setIsLoading(false);
            setCode('');

            if (err.response?.data?.message ===
                    ReciviedMessages.POOL_NOT_FIND) {
                        
                return toast.show({
                    title: 'Bolão não encontrado!',
                    placement: 'top',
                    bgColor: 'red.500'});
            }

            if (err.response?.data?.message ===
                    ReciviedMessages.YOU_ALREADY_JOINED_THIS_POOL) {

                return toast.show({
                    title: 'Você já está nesse bolão!',
                    placement: 'top',
                    bgColor: 'red.500'});
            }

            return toast.show({
                title: 'Não foi possível realizar a ação.',
                placement: 'top',
                bgColor: 'red.500'});
        }
    }

    return (

        <VStack flex={1} bgColor='gray.900'>
            <Header title="Buscar por código" showBackButton={true} />

            <VStack mt={6} mx={5} alignItems="center">
                <Heading fontFamily="heading" color="white" fontSize="xl" my={8} textAlign="center">
                    Encontre um bolão através de {'\n'} seu código único
                </Heading>

                <Input mt={2} placeholder="Qual o código do bolão?" value={code}
                    onChangeText={(text) => setCode(text.toUpperCase())}
                    autoCapitalize="characters"
                    maxLength={6}
                />

                <Button
                    title="BUSCAR BOLÃO"
                    mt={3}
                    isLoading={isLoading}
                    onPress={handleJoinPool}
                />
            </VStack>
        </VStack>

    );
}