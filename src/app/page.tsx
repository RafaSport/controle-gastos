import Badge from '@/components/ui/Badge';
import Botao from '@/components/ui/Botao';
import CartaoTag from '@/components/ui/CartaoTag';
import Input from '@/components/ui/Input';

export default function Home() {
    return (
        <main className="min-h-screen p-8 flex flex-col gap-8">
            <h1 className="text-2xl font-bold">Teste de Componentes</h1>

            {/* Botões */}
            <section className="flex flex-wrap gap-3">
                <Botao cor="azul">Azul</Botao>
                <Botao cor="verde">Verde</Botao>
                <Botao cor="amarelo">Amarelo</Botao>
                <Botao cor="cinza">Cinza</Botao>
                <Botao cor="vermelho">Vermelho</Botao>
                <Botao cor="azul" tamanho="sm">
                    Pequeno
                </Botao>
                <Botao cor="azul" tamanho="lg">
                    Grande
                </Botao>
                <Botao cor="azul" carregando>
                    Carregando
                </Botao>
            </section>

            {/* Badges */}
            <section className="flex gap-3">
                <Badge status="aberto" />
                <Badge status="finalizado" />
            </section>

            {/* Cartões */}
            <section className="flex gap-3">
                <CartaoTag cartao="NUBANK" />
                <CartaoTag cartao="INTER" />
                <CartaoTag cartao="HIPER" />
                <CartaoTag cartao="ITAU" />
            </section>

            {/* Inputs */}
            <section className="flex flex-col gap-3 max-w-sm">
                <Input label="Login" placeholder="seu.login" />

                <Input label="Senha" type="password" placeholder="••••••" />

                <Input
                    label="Com erro"
                    erro="Campo obrigatório"
                    placeholder="..."
                />

                <Input label="Email" type="email" placeholder="seu@email.com" />

                <Input label="Número" type="number" placeholder="123" />

                <Input
                    label="Telefone"
                    type="tel"
                    placeholder="(99) 99999-9999"
                />

                <Input label="URL" type="url" placeholder="https://..." />

                <Input label="Data" type="date" />

                <Input label="Hora" type="time" />

                <Input label="Cor" type="color" />

                <Input label="Arquivo" type="file" />
            </section>
        </main>
    );
}
