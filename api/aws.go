package main

import (
	"fmt"
	"mime/multipart"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
)

type AWSService struct {
	uploader   *s3manager.Uploader
	downloader *s3manager.Downloader
	deleter    *s3manager.BatchDelete
	bucketName *string
}

var AWS = &AWSService{
	bucketName: aws.String(os.Getenv("BUCKET_NAME")),
}

var aws_session = session.Must(session.NewSessionWithOptions(session.Options{Config: aws.Config{
	Region: aws.String(os.Getenv("BUCKET_REGION")),
}}))

func (a *AWSService) init() {

	a.uploader = s3manager.NewUploader(aws_session)
	a.downloader = s3manager.NewDownloader(aws_session)
	a.deleter = s3manager.NewBatchDelete(aws_session)

}

func (a *AWSService) get_file(key string) ([]byte, error) {
	var f = &aws.WriteAtBuffer{}

	size, err := a.downloader.Download(f, &s3.GetObjectInput{
		Bucket: a.bucketName,
		Key:    aws.String(key),
	})

	if err != nil {
		return nil, err
	}

	if size == 0 {
		return nil, fmt.Errorf("file not found")
	}

	return f.Bytes(), nil
}

func (a *AWSService) store_file(key string, file multipart.File) error {

	upParams := &s3manager.UploadInput{
		Bucket: a.bucketName,
		Key:    aws.String(key),
		Body:   file,
	}

	_, err := a.uploader.Upload(upParams, func(u *s3manager.Uploader) {
		u.PartSize = 10 * 1024 * 1024 // 10MB part size
		u.LeavePartsOnError = true
		// Don't delete the parts if the upload fails.
	})

	if err != nil {
		return err
	}

	return nil
}

func (a *AWSService) delete_file(key string) error {

	del := &s3.DeleteObjectInput{
		Bucket: a.bucketName,
		Key:    aws.String(key),
	}

	_, err := a.deleter.Client.DeleteObject(del)

	if err != nil {
		return err
	}

	return nil
}
