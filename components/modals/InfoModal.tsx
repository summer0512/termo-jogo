import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Cell } from "../grid/Cell";

type Props = {
  isOpen: boolean;
  handleClose: () => void;
};

export const InfoModal = ({ isOpen, handleClose }: Props) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose} modal>
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
            <Dialog.Description className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="bg-white rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <X className="h-6 w-6" aria-hidden="true" />
                  </button>
                </Dialog.Close>
              </div>
              <div>
                <div className="text-center">
                  <Dialog.Title className="text-lg leading-6 font-medium text-gray-900">
                    Como jogar
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Advinhe a palavra em 6 tentativas. Após cada tentativa, a cor
                      das células mudará para mostrar o quão perto sua palavra está
                      da palavra correta.
                    </p>

                    <div className="flex justify-center mb-1 mt-4">
                      <Cell value="Á" status="correct" />
                      <Cell value="G" />
                      <Cell value="U" />
                      <Cell value="A" />
                      <Cell value="S" />
                    </div>
                    <p className="text-sm text-gray-500">
                      A letra Á está na palavra e na posição correta.
                    </p>

                    <div className="flex justify-center mb-1 mt-4">
                      <Cell value="M" />
                      <Cell value="Ã" status="present" />
                      <Cell value="E" />
                      <Cell value="S" />
                      <Cell value="O" />
                    </div>
                    <p className="text-sm text-gray-500">
                      A letra Ã está na palavra mas na posição errada.
                    </p>

                    <div className="flex justify-center mb-1 mt-4">
                      <Cell value="L" />
                      <Cell value="I" />
                      <Cell value="V" />
                      <Cell value="R" status="absent" />
                      <Cell value="O" />
                    </div>
                    <p className="text-sm text-gray-500">
                      A letra R não está na palavra em nenhuma posição.
                    </p>
                  </div>
                </div>
              </div>
            </Dialog.Description>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
