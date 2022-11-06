import { useToast, FlatList } from 'native-base';
import { useState, useEffect } from 'react';

import { api } from '../services/api';
import { Loading } from '../components/Loading';

import { GameProps, Game } from '../components/Game'
import { ReciviedMessages } from '../@enum/reciviedMessages';
import { EmptyMyPoolList } from './EmptyMyPoolList';

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {

  const [isLoading, setIsLoading] = useState(false);
  const [ games, setGames ] = useState<GameProps[]>([]);

  const [firstTeamPoints, setFirstTeamPoints] = useState('');
  const [secondTeamPoints, setSecondTeamPoints] = useState('');

  const toast = useToast();

  async function fetchGames() {
    try {
      setIsLoading(true);
      const response = await api.get(`/pools/${poolId}/games`);
      setGames(response.data.games);
    } catch (err) {
        console.log(err);
        toast.show({
            title: 'Não foi possível carregar os jogos do bolão',
            placement: 'top',
            bgColor: 'red.500'
        })
    } finally {
        setIsLoading(false);
    }
  }

  async function handleGuessConfirm(gameId: string) {
    try {
      setIsLoading(true);

      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        return toast.show({
          title: 'Informe o placar do palpite',
          placement: 'top',
          bgColor: 'red.500'
        })
      }

      await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints)
      })

      toast.show({
        title: 'Palpite enviado com sucesso',
        placement: 'top',
        bgColor: 'green.500'
      })

      fetchGames();
      setFirstTeamPoints('');
      setSecondTeamPoints('');

    } catch (err) {
      console.log(err);

      if (err.response?.data?.message === ReciviedMessages.YOU_CANNOT_SEND_A_GUESS_AFTER_GAME) {
        toast.show({
          title: 'Você não pode fazer um palpite após o fim do jogo',
          placement: 'top',
          bgColor: 'red.500'
        })

      } else if (err.response?.data?.message === ReciviedMessages.YOU_CANT_CREATE_A_GUESS_IN_THIS_POOL) {
        toast.show({
          title: 'Você não pode criar um palpite nesse bolão',
          placement: 'top',
          bgColor: 'red.500'
        })
      } else if (err.response?.data?.message === ReciviedMessages.YOU_ALREADY_SENT_A_GUESS) {
        toast.show({
          title: 'Você já fez um palpite para esse jogo nesse bolão',
          placement: 'top',
          bgColor: 'red.500'
        })
      } else if (err.response?.data?.message === ReciviedMessages.GAME_NOT_FOUND) {
        toast.show({
          title: 'Jogo não encontrado',
          placement: 'top',
          bgColor: 'red.500'
        })
      } else {
        toast.show({
          title: 'Não foi possível enviar o palpite.',
          placement: 'top',
          bgColor: 'red.500'
      })

      }
    } finally {
        setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchGames();
  },[poolId]);

  if (isLoading) {
    return (
      <Loading />
    );
  }

  return (
    <FlatList
      data={games}
      keyExtractor={item => item.id}
      renderItem={({ item, index }) => (
        <Game
          data={item}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
          isSetPaddingBootom={index === (games.length - 1)}
        />
      )}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={() => (<EmptyMyPoolList code={code} />)}
    />
  );
}
