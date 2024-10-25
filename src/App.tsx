import React, { useState, useEffect, useRef } from 'react';
import logo from './assets/logo.png';

// Função auxiliar para mapear o número à letra correspondente
const getBingoLetter = (number: number): string => {
  if (number >= 1 && number <= 15) return 'B';
  if (number >= 16 && number <= 30) return 'I';
  if (number >= 31 && number <= 45) return 'N';
  if (number >= 46 && number <= 60) return 'G';
  if (number >= 61 && number <= 75) return 'O';
  return '';
};

// Tipagem das propriedades do componente Carousel
interface CarouselProps {
  images: string[];
  interval?: number;
  logoUrl?: string;
}

// Componente do carrossel de patrocinadores
const Carousel: React.FC<CarouselProps> = ({ images, interval = 3000, logoUrl }) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(slideInterval);
  }, [images.length, interval]);

  return (
    <div className="flex flex-col items-center w-full">
      {logoUrl && (
        <div className="mb-4 w-full flex justify-center">
          <img src={logoUrl} alt="Logo" className="max-w-full h-auto object-contain" />
        </div>
      )}
      <div className="carousel-container relative w-full h-64 sm:h-96 overflow-hidden">
        <div
          className="carousel-wrapper flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="carousel-slide flex-shrink-0 w-full h-full flex justify-center">
              <img src={image} alt={`Patrocinador ${index}`} className="max-w-full h-full object-contain" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Componente principal BingoLimeirense
const BingoLimeirense: React.FC = () => {
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [lastNumber, setLastNumber] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [intervalTime, setIntervalTime] = useState<number>(3);
  const [timeRemaining, setTimeRemaining] = useState<number>(intervalTime);
  const [allNumbersDrawn, setAllNumbersDrawn] = useState<boolean>(false); // Novo estado para controlar se todos os números foram sorteados
  const [openModal, setOpenModal] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const sponsorImages: string[] = [
    'https://via.placeholder.com/300x150?text=Patrocinador+1',
    'https://via.placeholder.com/300x150?text=Patrocinador+2',
    'https://via.placeholder.com/300x150?text=Patrocinador+3',
    'https://via.placeholder.com/300x150?text=Patrocinador+4',
  ];

  const logoUrl = logo;

  const generateRandomNumber = (): number => {
    const min = 1;
    const max = 75;
    let number: number;
    do {
      number = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (drawnNumbers.includes(number));
    return number;
  };

  const drawNumber = (): void => {
    if (drawnNumbers.length >= 75) {
      setOpenModal(true);
      setAllNumbersDrawn(true); // Define que todos os números foram sorteados
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    const newNumber = generateRandomNumber();
    setLastNumber(newNumber);
    setDrawnNumbers((prevNumbers) => [...prevNumbers, newNumber]);
    setTimeRemaining(intervalTime);
  };

  useEffect(() => {
    if (!isPaused && !allNumbersDrawn) {
      timerRef.current = setInterval(drawNumber, intervalTime * 1000);
      const countdownInterval = setInterval(() => {
        setTimeRemaining((prev) => (prev > 0 ? prev - 1 : intervalTime));
      }, 1000);

      return () => {
        clearInterval(countdownInterval);
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [isPaused, intervalTime, allNumbersDrawn]);

  const togglePause = (): void => {
    setIsPaused(!isPaused);
    if (!isPaused) {
      setTimeRemaining(intervalTime);
    }
  };

  const resetBingo = (): void => {
    setDrawnNumbers([]);
    setLastNumber(null);
    setIsPaused(true);
    setTimeRemaining(intervalTime);
    setAllNumbersDrawn(false); // Reinicia o estado dos números sorteados
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-blue-600 p-4 space-y-6 lg:space-x-6 lg:space-y-0">
      {/* Modal para indicar que todos os números foram sorteados */}
      {openModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Todos os números já foram sorteados!</h2>
            <button
              onClick={() => setOpenModal(false)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Carrossel de patrocinadores - responsivo */}
      <div className="w-full lg:w-1/4 flex justify-center">
        <Carousel images={sponsorImages} logoUrl={logoUrl} interval={4000} />
      </div>

      {/* Conteúdo do Bingo */}
      <div className="flex flex-col items-center w-full lg:w-1/2 space-y-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 bg-white shadow-lg rounded-lg p-3">
          Bingo Limeirense
        </h1>

        <div className="bg-white shadow-lg rounded-lg p-6 w-full text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold">Último número sorteado:</h2>
          <div className="text-8xl sm:text-[12rem] font-extrabold text-black-600" style={{ lineHeight: '1.1' }}>
            {lastNumber ? `${getBingoLetter(lastNumber)}-${lastNumber}` : '---'}
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto w-full">
          {drawnNumbers.map((number, index) => (
            <div key={index} className="text-lg sm:text-xl bg-gray-200 shadow-lg rounded-lg p-2 font-bold text-center">
              {getBingoLetter(number)}-{number}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          {/* Esconder botões de Reiniciar e Sortear Agora quando todos os números forem sorteados */}
          {!allNumbersDrawn && (
            <>
              <button
                onClick={togglePause}
                className={`px-6 py-2 text-white rounded-md ${isPaused ? 'bg-green-500 hover:bg-green-700' : 'bg-red-500 hover:bg-red-700'}`}
              >
                {isPaused ? (drawnNumbers.length > 0 ? 'Reiniciar Sorteio' : 'Iniciar Sorteio') : 'Pausar'}
              </button>
              <button onClick={drawNumber} className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-700">
                Sortear Agora
              </button>
            </>
          )}
          <button onClick={resetBingo} className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-700">
            Resetar Bingo
          </button>
        </div>

        <div className="flex flex-col items-center">
          <label className="mb-2 text-xl font-semibold">Intervalo entre sorteios (segundos):</label>
          <input
            type="number"
            value={intervalTime}
            onChange={(e) => {
              setIntervalTime(Number(e.target.value));
              setTimeRemaining(Number(e.target.value));
            }}
            className="p-2 border border-gray-300 rounded-md text-center"
          />
        </div>

        <div className="bg-gray-200 p-4 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold">Próximo número em: {timeRemaining} segundos</h3>
        </div>
      </div>

      {/* Outro carrossel de patrocinadores - responsivo */}
      <div className="w-full lg:w-1/4 flex justify-center">
        <Carousel images={sponsorImages} logoUrl={logoUrl} interval={4000} />
      </div>
    </div>
  );
};

export default BingoLimeirense;
