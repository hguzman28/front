locals {
  s3_origin_id = "myS3Origin"
}
resource "aws_cloudfront_origin_access_identity" "origin_access_identity" {
  comment = "s3-my-webapp.example.com"
}

resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name = aws_s3_bucket.s3-bucket-example.bucket_regional_domain_name
    origin_id   = local.s3_origin_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.origin_access_identity.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = var.comment_cloudfront
  default_root_object = "index.html"

  /* logging_config {
    include_cookies = false
    bucket          = "mylogs.s3.amazonaws.com"
    prefix          = "myprefix"
  } */

######## START certificate with domain personalizado ######
  /* aliases = var.aliases */

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = false

      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https" # Or value allow-all for http and https
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }




  price_class = "PriceClass_200"

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["IN", "US", "CA","CO"]
    }
  }

  tags=var.tags

  ######## START certificate with domain personalizado ######
  /* viewer_certificate {
    acm_certificate_arn      = var.acm_certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.1_2016"
  } */
  ######## END certificate with domain personalizado ######

    viewer_certificate {
    cloudfront_default_certificate = true
  }

custom_error_response {
        error_code            = 404
        response_code         = 200
        response_page_path    = "/index.html"
      }

custom_error_response {
        error_code            = 403
        response_code         = 200
        response_page_path    = "/index.html"
      }

    }

