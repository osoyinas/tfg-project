package es.uah.pablopinas.gateway;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class LoggingGlobalFilter implements GlobalFilter, Ordered {
    private static final Logger logger = LoggerFactory.getLogger(LoggingGlobalFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, org.springframework.cloud.gateway.filter.GatewayFilterChain chain) {
        logger.info("Request: {} {} Headers: {}",
                exchange.getRequest().getMethod(),
                exchange.getRequest().getURI(),
                exchange.getRequest().getHeaders());

        return chain.filter(exchange)
                .doOnError(error -> logger.error("Request rejected: {} {} Reason: {}",
                        exchange.getRequest().getMethod(),
                        exchange.getRequest().getURI(),
                        error.getMessage()))
                .doFinally(signalType -> logger.info("Response for: {} {} Status: {}",
                        exchange.getRequest().getMethod(),
                        exchange.getRequest().getURI(),
                        exchange.getResponse().getStatusCode()));
    }

    @Override
    public int getOrder() {
        return -1; // Alta prioridad
    }
}