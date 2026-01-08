# Roadmap.sh Personal Blog - Requirements

- Build a personal blog for two user types: **guest** and **admin**
  - Guest: can view the home page and article pages (read-only)
  - Admin: can do everything a guest can, plus add new articles and edit existing articles

## Untuk implementasinya (Implementation)

1. Storage

   - Artikel akan disimpan ke dalam folder tersendiri berisi judul, konten, dan tanggal publikasinya
   - Format: JSON atau Markdown
2. Backend

   - Backend bebas; tidak harus berbasis API
   - Backend juga harus merender halaman dan menangani submit data
3. Frontend

   - Hanya HTML dan CSS
4. Authentication

   - HTTP Basic Auth

## What they expect from building this project

1. Templating
2. Filesystem operations
3. Basic auth
4. Form handling
5. Render HTML from server
