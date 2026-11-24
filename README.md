# Struktur Wallet Farming (Burner) — disiapkan 24 Nov 2026

Tujuan: garap airdrop yang butuh connect wallet + tanda tangan bisa berjalan dari
sisi Muse/VPS tanpa komputer user menyala, memakai wallet KHUSUS farming
(burner) — bukan wallet utama user.

## Aturan keselamatan (tidak bisa ditawar)
1. Wallet ini burner: isinya hanya dana kecil untuk gas fee. Jangan pernah
   menyimpan dana besar di sini.
2. Secret key lahir dan tinggal di mesin tempat wallet dibuat (VPS Altare,
   ~/airdrop/farming/keys/, mode 600). Tidak pernah dikirim lewat chat,
   tidak pernah ditampilkan, tidak pernah disalin ke mesin lain.
3. Script generator dirancang hanya mencetak ALAMAT PUBLIK. Siapa pun yang
   menjalankan script ini tidak melihat secret-nya.
4. Seed phrase wallet utama user tidak pernah terlibat dalam setup ini.
5. Kalau alamat ini terekspos pun, kerugian maksimal = isi burner saja.
   Isi ulang hanya seperlunya.

## Isi paket
- `generate_solana_wallet.mjs` — membuat keypair Solana (ed25519, tanpa
  dependensi), menulis secret ke file 0600, mencetak alamat publik saja.
  Menolak menimpa file yang sudah ada.
- `check_balance.mjs` — membaca file kunci hanya untuk menurunkan alamat,
  lalu mencetak alamat + saldo SOL dari RPC publik.

## Lokasi deploy
- VPS Altare: `~/airdrop/farming/` (script) + `~/airdrop/farming/keys/` (kunci)
- Salinan paket sumber: `~/workspace/farming-setup/` di komputer Muse.

## Cara pakai setelah deploy
- Cek alamat + saldo: `node check_balance.mjs ~/airdrop/farming/keys/solana_burner.json`
- Bot/script farming membaca kunci dari file yang sama; tidak ada kunci di
  dalam kode atau chat.

## Status
- 24 Nov 2026: paket dibuat dan diuji lokal (alamat valid, file 600, cek saldo
  jalan). Wallet uji lokal sudah dihapus.
- DEPLOYED 24 Nov 2026 21:53 WIB ke VPS Altare (~/airdrop/farming/).
  Alamat publik burner: CE4jU3LVonN4BFG3G4SwMhSRrp5VBaVUzQK5hsDkob3A
  Saldo awal 0 SOL. File kunci /root/airdrop/farming/keys/solana_burner.json
  mode 600, isinya tidak pernah ditampilkan.
- Pelajaran deploy: terminal web Altare sangat lambat saat "heavy demand" dan
  merusak kode panjang yang diketik/heredoc (baris hilang). Cara yang berhasil:
  unduh script dari repo GitHub ini dengan curl, perintah pendek saja.
