// Modal de cadastro de compra — versão refatorada
// Toda lógica extraída para:
//   - useCadastroCompra (hook de estado e validação)
//   - SeletorCartao (subcomponente de UI)
//   - PreviewParcelas (subcomponente de UI)

'use client';

import { MESES, useCadastroCompra } from '@/hooks/useCadastroCompra';
import Botao from './Botao';
import Input from './Input';
import Modal from './Modal';
import PreviewParcelas from './compra/PreviewParcelas';
import SeletorCartao from './compra/SeletorCartao';

// ============================================
// INTERFACE — Props do modal
// ============================================

interface Props {
    aberto: boolean;
    usuarioId: string;
    onFechar: () => void;
    onSalvar: () => void;
}

// ============================================
// COMPONENTE PRINCIPAL — Apenas renderização
// ============================================

export default function ModalCadastroCompra({
    aberto,
    usuarioId,
    onFechar,
    onSalvar,
}: Props) {
    // ----------------------------------------
    // HOOK — Toda a lógica de estado, validação e submit
    // ----------------------------------------
    const {
        // Estados do formulário
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

        // UI
        erro,
        alertaInicio,
        alertaCompra,
        carregando,

        // Derivados
        mesAtual,
        anoAtual,
        mesFinalPreview,

        // Ação
        handleSalvar,
    } = useCadastroCompra({ usuarioId, aberto, onSalvar, onFechar });

    // ----------------------------------------
    // RENDERIZAÇÃO
    // ----------------------------------------
    return (
        <Modal
            aberto={aberto}
            titulo="Nova Compra"
            onFechar={onFechar}
            tamanho="lg"
        >
            <div className="flex flex-col gap-4">
                {/* Seletor de cartão — subcomponente reutilizável */}
                <SeletorCartao cartao={cartao} onChange={setCartao} />

                {/* Descrição da compra */}
                <Input
                    label="Descrição"
                    placeholder="Ex: Notebook Dell"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                />

                {/* Mês e ano da compra */}
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
                            {MESES.map((m, i) => {
                                const desabilitado =
                                    anoCompra === anoAtual && i + 1 > mesAtual;
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
                        onChange={(e) => setAnoCompra(Number(e.target.value))}
                    />
                </div>

                {/* Alerta: compra muito antiga */}
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

                {/* Mês e ano de início */}
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
                            {MESES.map((m, i) => {
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
                        onChange={(e) => setAnoInicio(Number(e.target.value))}
                    />
                </div>

                {/* Alerta: início muito distante da compra */}
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

                {/* Parcelas e valor */}
                <div className="grid grid-cols-2 gap-3">
                    <Input
                        label="Qtd. parcelas"
                        type="number"
                        value={qtdParcelas}
                        onChange={(e) => setQtdParcelas(Number(e.target.value))}
                    />
                    <Input
                        label="Valor da parcela (R$)"
                        placeholder="Ex: 150,00"
                        value={valorParcela}
                        onChange={(e) => setValorParcela(e.target.value)}
                    />
                </div>

                {/* Preview do mês final — subcomponente reutilizável */}
                <PreviewParcelas mesFinal={mesFinalPreview} />

                {/* Erro de validação/submit */}
                {erro && (
                    <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                        <span className="text-red-400 shrink-0">⚠</span>
                        <p className="text-xs text-red-400">{erro}</p>
                    </div>
                )}

                {/* Botões de ação */}
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
            </div>
        </Modal>
    );
}