rsync -aP --filter="+ dist" --filter=':- .gitignore' . $SYNC_SSH:/$REMOTE_DIR 
