-- Currículos: aceita só PDF (até 4 MB), alinhado à validação de /api/candidaturas.
update storage.buckets
set allowed_mime_types = array['application/pdf'],
    file_size_limit = 4194304
where id = 'curriculos';
