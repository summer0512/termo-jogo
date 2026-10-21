import * as Dialog from "@radix-ui/react-dialog";
import { X, Copy } from "lucide-react";
import { useState } from "react";
import { copyToClipboard } from "../../lib/share";

type Props = {
  isOpen: boolean;
  handleClose: () => void;
  wordLength: number;
  validateWord: (word: string) => string | null;
  buildChallengeUrl: (canonicalWord: string) => Promise<string>;
};

export const CreateGameModal = ({ isOpen, handleClose, wordLength, validateWord, buildChallengeUrl }: Props) => {
  const [inputWord, setInputWord] = useState("");
  const [error, setError] = useState("");
  const [challengeUrl, setChallengeUrl] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    if (/^[A-ZÀ-ÿ]*$/.test(value) && value.length <= wordLength) {
      setInputWord(value);
      setError("");
      setChallengeUrl("");
    }
  };

  const generateChallengeUrl = async () => {
    if (inputWord.length !== wordLength) {
      setError(`A palavra deve ter exatamente ${wordLength} letras.`);
      return;
    }

    const canonical = validateWord(inputWord);

    if (!canonical) {
      setError("Esta palavra não existe no nosso dicionário. Tente outra palavra.");
      return;
    }

    const url = await buildChallengeUrl(canonical);
    setChallengeUrl(url);
    setInputWord(canonical);
    setError("");

    // 直接复制到剪贴板
    const success = await copyToClipboard(url);
    if (success) {
      setShowCopiedMessage(true);
    }
  };

  const handleCopyLink = async () => {
    if (challengeUrl) {
      const success = await copyToClipboard(challengeUrl);
      if (success) {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      generateChallengeUrl();
    }
  };

  const handleReset = () => {
    setInputWord("");
    setError("");
    setChallengeUrl("");
    setCopySuccess(false);
    setShowCopiedMessage(false);
  };

  const handleCloseModal = () => {
    handleReset();
    handleClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleCloseModal}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        <Dialog.Content className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Dialog.Description className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={handleCloseModal}
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              
              <div className="sm:flex sm:items-start">
                <div className="w-full mt-3 text-center sm:mt-0 sm:text-left">
                  <Dialog.Title className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Criar um desafio
                  </Dialog.Title>
                  
                  <p className="text-sm text-gray-600 mb-4">
                        Desafie seus amigos com qualquer palavra de {wordLength} {wordLength === 1 ? "letra" : "letras"}:
                  </p>

                  <div className="mb-4">
                    <input
                      autoFocus
                      type="text"
                      value={inputWord}
                      onChange={handleInputChange}
                      placeholder="Sua palavra..."
                      className="w-full px-3 py-3 text-center text-lg font-bold uppercase border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent"
                      maxLength={wordLength}
                    />
                    <div className="mt-2 text-xs text-gray-500 text-center">
                      {inputWord.length}/{wordLength} letras
                    </div>
                  </div>

                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  {showCopiedMessage && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm text-green-700">
                        ✓ Link copiado para a área de transferência!
                      </p>
                    </div>
                  )}

                  <div className="mt-6 space-y-3">
                    {!challengeUrl ? (
                      <button
                        type="button"
                        onClick={generateChallengeUrl}
                        disabled={inputWord.length !== wordLength}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-green text-base font-medium text-white hover:bg-primary-green/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green sm:text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        CRIAR LINK
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleReset}
                        className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-green sm:text-sm"
                      >
                        CRIAR OUTRO DESAFIO
                      </button>
                    )}
                  </div>

                  {challengeUrl && (
                    <div className="mt-4 space-y-3">
                      <div className="p-3 bg-gray-50 border border-gray-200 rounded-md text-left">
                        <p className="text-xs font-semibold uppercase text-gray-500 mb-2">
                          Link do desafio
                        </p>
                        <div className="text-sm break-all text-gray-700">
                          {challengeUrl}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="inline-flex justify-center w-full items-center space-x-2 px-3 py-2 text-sm text-white bg-primary-green hover:bg-primary-green/80 rounded-md transition-colors"
                      >
                        <Copy className="h-4 w-4" />
                        <span>{copySuccess ? "Copiado!" : "Copiar link"}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Dialog.Description>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
