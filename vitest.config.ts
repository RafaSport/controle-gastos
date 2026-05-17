import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // Nome da pasta/padrão de arquivos de teste
        include: ['src/__tests__/**/*.test.ts'],
        // Ambiente Node.js (sem DOM — perfeito para utils e services)
        environment: 'node',
        // Cobertura habilitada apenas quando rodar com --coverage
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            exclude: [
                'node_modules/',
                'src/__tests__/',
                'src/generated/',
                '**/*.d.ts',
            ],
        },
        // Limpa mocks automaticamente entre cada teste
        mockReset: true,
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
