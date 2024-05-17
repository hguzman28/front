output "bucket_domain_name-s3"{
    value = aws_s3_bucket.s3-bucket-example.bucket_domain_name
}

output "arn-s3"{
    value = aws_s3_bucket.s3-bucket-example.arn 
}

output "bucket-s3"{
    value = aws_s3_bucket.s3-bucket-example.bucket 
}

output "cloudfront-all"{

    value = aws_cloudfront_distribution.s3_distribution.domain_name
}

