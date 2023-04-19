enum Status {
  completed = 'COMPLETED',
  failed = 'FAILED',
  inProgress = 'IN_PROGRESS',
}

enum FileType {
  csv = 'text/csv',
}

enum FileSize {
  'Bytes' = 'bytes',
  'KB' = 'KB',
  'MB' = 'MB',
}

export { FileSize, FileType, Status };
