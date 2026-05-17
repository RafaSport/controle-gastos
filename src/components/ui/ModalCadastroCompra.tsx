'use client';

import { useCadastroCompra } from '@/hooks/useCadastroCompra';
import Botao from './Botao';
import Feedback from './Feedback';
import Input from './Input';
import Modal from './Modal';
import PreviewParcelas from './compra/PreviewParcelas';
import SeletorCartao from './compra/SeletorCartao';

interface Props {
    aberto: boolean;
    usuarioId: string;
    onFechar: () => void;
    onSalvar: () => void;
}

export default function ModalCadastroCompra({
    aberto,
    usuarioId,
    onFechar,
    onSalvar,
}: Props) {
    const {
        cartao,
        setCartao,
        descricao,
        setDescricao,
        mesCompra,
        setMesCompra,
        anoCompra,
        setAnoCompra,
        mesInicio,
        setMesInicio,
        anoInicio,
        setAnoInicio,
        qtdParcelas,
        setQtdParcelas,
        valorParcela,
        setValorParcela,
        carregando,
        feedback,
        alertaInicio,
        alertaCompra,
        mesAtual,
        anoAtual,
        mesFinalPreview,
        handleSalvar,
        limparFeedback,
    } = useCadastroCompra({ usuarioId, aberto, onSalvar, onFechar });

    return (
        <Modal
            aberto={aberto}
            titulo="Nova Compra"
            onFechar={onFechar}
            tamanho="lg"
        >
            <div className="flex flex-col gap-4">
                {feedback ? (
                    <Feedback
                        tipo={feedback.tipo}
                        mensagem={feedback.msg}
                        onConcluir={limparFeedback}
                    />
                ) : (
                    <>
                        <SeletorCartao cartao={cartao} onChange={setCartao} />

                        <Input
                            label="Descrição"
                            placeholder="Ex: Notebook Dell"
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                        />

                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-zinc-300">
                                    Mês da compra
                                </label>
                                <select
                                    value={mesCompra}
                                    onChange={(e) =>
                                        setMesCompra(Number(e.target.value))
                                    }
                                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {[
                                        'Jan',
                                        'Fev',
                                        'Mar',
                                        'Abr',
                                        'Mai',
                                        'Jun',
                                        'Jul',
                                        'Ago',
                                        'Set',
                                        'Out',
                                        'Nov',
                                        'Dez',
                                    ].map((m, i) => {
                                        const desabilitado =
                                            anoCompra === anoAtual &&
                                            i + 1 > mesAtual;
                                        return (
                                            <option
                                                key={i}
                                                value={i + 1}
                                                disabled={desabilitado}
                                            >
                                                {m}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <Input
                                label="Ano da compra"
                                type="number"
                                value={anoCompra}
                                max={anoAtual}
                                onChange={(e) =>
                                    setAnoCompra(Number(e.target.value))
                                }
                            />
                        </div>

                        {alertaCompra && (
                            <div className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2">
                                <span className="text-yellow-400 shrink-0 mt-0.5">
                                    ⚠
                                </span>
                                <p className="text-xs text-yellow-400">
                                    {alertaCompra}
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium text-zinc-300">
                                    Mês de início
                                </label>
                                <select
                                    value={mesInicio}
                                    onChange={(e) =>
                                        setMesInicio(Number(e.target.value))
                                    }
                                    className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {[
                                        'Jan',
                                        'Fev',
                                        'Mar',
                                        'Abr',
                                        'Mai',
                                        'Jun',
                                        'Jul',
                                        'Ago',
                                        'Set',
                                        'Out',
                                        'Nov',
                                        'Dez',
                                    ].map((m, i) => {
                                        const desabilitado =
                                            anoInicio === anoCompra &&
                                            i + 1 < mesCompra;
                                        return (
                                            <option
                                                key={i}
                                                value={i + 1}
                                                disabled={desabilitado}
                                            >
                                                {m}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                            <Input
                                label="Ano de início"
                                type="number"
                                value={anoInicio}
                                onChange={(e) =>
                                    setAnoInicio(Number(e.target.value))
                                }
                            />
                        </div>

                        {alertaInicio && (
                            <div className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2">
                                <span className="text-yellow-400 shrink-0 mt-0.5">
                                    ⚠
                                </span>
                                <p className="text-xs text-yellow-400">
                                    {alertaInicio}
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                label="Qtd. parcelas"
                                type="number"
                                value={qtdParcelas}
                                onChange={(e) =>
                                    setQtdParcelas(Number(e.target.value))
                                }
                            />
                            <Input
                                label="Valor da parcela (R$)"
                                placeholder="Ex: 150,00"
                                value={valorParcela}
                                onChange={(e) =>
                                    setValorParcela(e.target.value)
                                }
                            />
                        </div>

                        <PreviewParcelas mesFinal={mesFinalPreview} />

                        <div className="flex gap-2 justify-end">
                            <Botao cor="cinza" onClick={onFechar}>
                                Cancelar
                            </Botao>
                            <Botao
                                cor="verde"
                                carregando={carregando}
                                onClick={handleSalvar}
                            >
                                Salvar
                            </Botao>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
}