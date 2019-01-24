#!/usr/bin/env bash
TIMESTAMP=`date +%F-%H%M`
BACKUPS_DIR="backups"
BACKUP_NAME="TOC-BACKUP-$TIMESTAMP"

rm -rf dump

docker-compose run mongo mongodump --host mongo:27017 --db toc

mkdir -p $BACKUPS_DIR
mv dump $BACKUP_NAME
tar -zcvf $BACKUPS_DIR/$BACKUP_NAME.tgz $BACKUP_NAME
rm -rf $BACKUP_NAME

if [ -e $BACKUPS_DIR/$BACKUP_NAME.tgz ]; then
	
	#push to S3
	aws s3 cp $BACKUPS_DIR/$BACKUP_NAME.tgz s3://toc.app.backup/$BACKUP_NAME.tgz --profile toc_backup
	
	# Test result of last command run
    if [ "$?" -ne "0" ]; then
        echo "Upload to S3 failed"
        exit 1
    fi
	
	# If success, remove backup file
    rm $BACKUPS_DIR/$BACKUP_NAME.tgz

	echo Backup $BACKUP_NAME.tgz successfuly created
    # Exit with no error
    exit 0
fi

# Exit with error if we reach this point
echo "Backup file not created"
exit 1
