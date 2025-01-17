import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

const element = document.getElementById('root');

if (element) {
  const collectionId = element.dataset.collectionId;
  const currency = element.dataset.shopCurrency;
  const language = element.dataset.shopLanguage;

    createRoot(element!).render(
      <StrictMode>
        {collectionId && currency && language &&
          <App collectionId={collectionId} currency={currency} language={language} />
        }
      </StrictMode>,
    );
}
