import React, { useState, useEffect } from 'react';

// Função auxiliar para mapear o número à letra correspondente
const getBingoLetter = (number: number): string => {
  if (number >= 1 && number <= 15) return 'B';
  if (number >= 16 && number <= 30) return 'I';
  if (number >= 31 && number <= 45) return 'N';
  if (number >= 46 && number <= 60) return 'G';
  if (number >= 61 && number <= 75) return 'O';
  return '';
};

// Componente do carrossel de patrocinadores
interface CarouselProps {
  images: string[];
  interval?: number;
  logoUrl?: string;
}

const Carousel: React.FC<CarouselProps> = ({ images, interval = 3000, logoUrl }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(slideInterval);
  }, [images.length, interval]);

  return (
    <div className="flex flex-col items-center">
      {/* Exibir o logotipo acima do carrossel */}
      {logoUrl && (
        <div className="mb-4">
          <img src={logoUrl} alt="Logo" className="w-32 h-auto object-contain" />
        </div>
      )}
      <div className="carousel-container relative w-full h-64 overflow-hidden">
        <div
          className="carousel-wrapper flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="carousel-slide flex-shrink-0 w-full h-64 flex justify-center">
              <img src={image} alt={`Patrocinador ${index}`} className="w-full h-full object-contain" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BingoLimeirense: React.FC = () => {
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [lastNumber, setLastNumber] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [intervalTime, setIntervalTime] = useState<number>(3); // Intervalo de sorteio em segundos
  const [timeRemaining, setTimeRemaining] = useState<number>(intervalTime); // Tempo restante até o próximo sorteio
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Substitua pelas URLs reais das imagens dos patrocinadores e logotipos
  const sponsorImages = [
    'https://via.placeholder.com/300x150?text=Patrocinador+1',
    'https://via.placeholder.com/300x150?text=Patrocinador+2',
    'https://via.placeholder.com/300x150?text=Patrocinador+3',
    'https://via.placeholder.com/300x150?text=Patrocinador+4',
  ];

  const logoUrl = 'https://via.placeholder.com/100x50?text=Logo';

  const generateRandomNumber = (): number => {
    const min = 1;
    const max = 75;
    let number;
    do {
      number = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (drawnNumbers.includes(number));
    return number;
  };

  const drawNumber = () => {
    if (drawnNumbers.length >= 75) {
      alert('Todos os números já foram sorteados!');
      clearInterval(timerRef.current!);
      return;
    }
    const newNumber = generateRandomNumber();
    setLastNumber(newNumber);
    setDrawnNumbers((prevNumbers) => [...prevNumbers, newNumber]);
    setTimeRemaining(intervalTime); // Reseta o contador de tempo
  };

  // Controla o tempo até o próximo sorteio
  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(drawNumber, intervalTime * 1000); // Sorteia o número
      const countdownInterval = setInterval(() => {
        setTimeRemaining((prev) => (prev > 0 ? prev - 1 : intervalTime));
      }, 1000);

      return () => {
        clearInterval(countdownInterval);
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [isPaused, intervalTime]);

  const togglePause = () => {
    setIsPaused(!isPaused);
    if (!isPaused) {
      setTimeRemaining(intervalTime); // Reseta o tempo quando for pausado
    }
  };

  const resetBingo = () => {
    setDrawnNumbers([]);
    setLastNumber(null);
    setIsPaused(true);
    setTimeRemaining(intervalTime); // Reseta o contador de tempo
  };

  return (
    <div className="flex flex-row items-center justify-center min-h-screen bg-gray-100 p-4 overflow-hidden space-x-6">
      
      {/* Carrossel de patrocinadores - lado esquerdo */}
      <div className="w-1/4">
        <Carousel images={sponsorImages} logoUrl={logoUrl} interval={4000} />
      </div>

      {/* Conteúdo do Bingo no centro */}
      <div className="flex flex-col items-center justify-center space-y-6 w-1/2">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">Bingo Limeirense</h1>

        {/* Último número sorteado com a letra correspondente */}
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm text-center">
          <h2 className="text-3xl font-semibold">Último número sorteado:</h2>
          <div className="text-9xl font-extrabold text-red-600 mt-4" style={{ lineHeight: '1.1' }}>
            {lastNumber ? `${getBingoLetter(lastNumber)}-${lastNumber}` : '---'}
          </div>
        </div>

        {/* Números sorteados com área fixa e scroll interno */}
        <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto">
          {drawnNumbers.map((number, index) => (
            <div key={index} className="text-2xl bg-gray-200 p-4 rounded-lg shadow-md">
              {getBingoLetter(number)}-{number}
            </div>
          ))}
        </div>

        {/* Botões de controle */}
        <div className="flex space-x-4">
          <button
            onClick={togglePause}
            className={`px-6 py-2 text-white rounded-md ${
              isPaused ? 'bg-green-500 hover:bg-green-700' : 'bg-red-500 hover:bg-red-700'
            }`}
          >
            {isPaused ? 'Iniciar Sorteio' : 'Pausar'}
          </button>
          <button onClick={resetBingo} className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-700">
            Resetar Bingo
          </button>
          {/* Botão para sortear um número a qualquer momento */}
          <button
            onClick={drawNumber}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
          >
            Sortear Agora
          </button>
        </div>

        {/* Controle de intervalo de sorteio */}
        <div className="flex flex-col items-center">
          <label className="mb-2 text-xl font-semibold">Intervalo entre sorteios (segundos):</label>
          <input
            type="number"
            value={intervalTime}
            onChange={(e) => {
              setIntervalTime(Number(e.target.value));
              setTimeRemaining(Number(e.target.value)); // Atualiza o contador para refletir o novo intervalo
            }}
            className="p-2 border border-gray-300 rounded-md text-center"
          />
        </div>

        {/* Contador de tempo restante */}
        <div className="bg-gray-200 p-4 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold">Próximo número em: {timeRemaining} segundos</h3>
        </div>
      </div>

      {/* Carrossel de patrocinadores - lado direito */}
      <div className="w-1/4">
        <Carousel images={sponsorImages} logoUrl={logoUrl} interval={4000} />
      </div>

    </div>
  );
};

export default BingoLimeirense;