export interface BankAccount {
  id: string
  currency: 'TRY' | 'USD' | 'EUR'
  currencySymbol: string
  currencyName: string
  bankName: string
  accountHolder: string
  iban: string
  branchCode?: string
  accountNumber?: string
  swiftCode?: string
}

export const DONATION_ACCOUNTS: BankAccount[] = [
  {
    id: 'try-main',
    currency: 'TRY',
    currencySymbol: '₺',
    currencyName: 'Türk Lirası Hesabı',
    bankName: 'Kuveyt Türk Katılım Bankası',
    accountHolder: 'İki Kelam İlim ve Kültür Derneği',
    iban: 'TR12 0020 5000 0123 4567 8901 01',
    branchCode: '205 - Fatih Şubesi',
    accountNumber: '12345678-1',
  },
  {
    id: 'usd-main',
    currency: 'USD',
    currencySymbol: '$',
    currencyName: 'Amerikan Doları Hesabı',
    bankName: 'Kuveyt Türk Katılım Bankası',
    accountHolder: 'İki Kelam İlim ve Kültür Derneği',
    iban: 'TR12 0020 5000 0123 4567 8901 02',
    branchCode: '205 - Fatih Şubesi',
    swiftCode: 'KTEFTRISXXX',
  },
  {
    id: 'eur-main',
    currency: 'EUR',
    currencySymbol: '€',
    currencyName: 'Euro Hesabı',
    bankName: 'Kuveyt Türk Katılım Bankası',
    accountHolder: 'İki Kelam İlim ve Kültür Derneği',
    iban: 'TR12 0020 5000 0123 4567 8901 03',
    branchCode: '205 - Fatih Şubesi',
    swiftCode: 'KTEFTRISXXX',
  },
]

export const DONATION_NOTE =
  'Bağış yaparken açıklama kısmına Ad-Soyad ve bağış türünü (Genel Bağış, Talebe Bursu, İaşe, Zekat) belirtmenizi rica ederiz.'
